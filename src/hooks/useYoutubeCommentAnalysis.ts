import { useState, useEffect, useCallback, useRef } from "react";
import { getTop3VideosByViews, getVideoComments } from "../services/googleApiYoutube";
import { analyzeComments } from "../services/openai";

type CommentsByVideo = Record<string, string[]>;
type Stage = "Fetching top videos" | "Fetching comments" | "Analyzing comments" | "Done" | null;

function isString(x: unknown): x is string {
    return typeof x === "string";
}

export function useYoutubeCommentAnalysis(channelId: string | null) {
    const [data, setData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingStage, setLoadingStage] = useState<Stage>(null);

    // Keep the latest AbortSignal so we can guard state updates centrally
    const latestSignal = useRef<AbortSignal | null>(null);

    const safeSet = <T>(setter: (v: T) => void, value: T) => {
        const s = latestSignal.current;
        if (!s || !s.aborted) setter(value);
    };

    const load = useCallback(
        async (signal?: AbortSignal) => {
            if (!channelId) {
                return;
            }
            latestSignal.current = signal ?? null;
            try {
                // 1) Get top 3 videos

                safeSet(setError, null);
                safeSet(setLoadingStage, "Fetching top videos");
                safeSet(setData, null); // avoid stale display

                const top3 = await getTop3VideosByViews(channelId, signal);

                if (signal?.aborted) return;

                const videoIds = (top3.items ?? [])
                    .map((it) => {
                        const videoId = it?.id?.videoId;
                        return videoId as unknown;
                    })
                    .filter(isString);

                if (videoIds.length === 0) {
                    safeSet(setData, "No videos found for this channel.");
                    safeSet(setLoadingStage, "Done");
                    return;
                }

                safeSet(setLoadingStage, "Fetching comments");

                // 2) Fetch comment threads (per-video failures don’t cancel others)
                const settled = await Promise.allSettled(videoIds.map((vid) => getVideoComments(vid, signal)));

                if (signal?.aborted) return;

                // Build Record<string, string[]>
                const byVideo: CommentsByVideo = {};
                settled.forEach((res, idx) => {
                    const vid = videoIds[idx];
                    byVideo[vid] = [];
                    if (res.status === "fulfilled" && Array.isArray(res.value)) {
                        for (const t of res.value) {
                            const text = t?.snippet?.topLevelComment?.snippet?.textOriginal;
                            if (isString(text)) byVideo[vid].push(text);
                        }
                    } else if (res.status === "rejected") {
                        // optional: attach an empty array or a placeholder message
                        // byVideo[vid].push(`[comments unavailable: ${String(res.reason)}]`);
                    }
                });

                if (signal?.aborted) return;

                // 3) Analyze comments using openai
                safeSet(setLoadingStage, "Analyzing comments");
                const analysis = await analyzeComments(byVideo, signal);

                if (signal?.aborted) return;

                safeSet(setData, analysis);
                safeSet(setLoadingStage, "Done");
            } catch (e: unknown) {
                // Don't treat abort as an error
                if (e instanceof Error && e.name === "AbortError") return;
                const msg = e instanceof Error ? e.message : String(e);
                console.error("useYoutubeCommentAnalysis:", msg);
                safeSet(setError, msg);
            }
        },
        [channelId]
    );

    // Run on mount / channelId change
    useEffect(() => {
        const controller = new AbortController();
        latestSignal.current = controller.signal;
        load(controller.signal);
        return () => controller.abort();
    }, [load]);

    // Manual refetch — returns the controller so callers can abort if they want
    const refetch = useCallback(() => {
        const controller = new AbortController();
        latestSignal.current = controller.signal;
        void load(controller.signal);
        return controller;
    }, [load]);

    return { data, loadingStage, error, refetch };
}

export default useYoutubeCommentAnalysis;
