import { useState, useEffect, useCallback } from "react";
import { getTop3VideosByViews, getVideoComments } from "../services/googleApiYoutube";

type CommentsByVideo = Record<string, string[]>;

export function useYoutubeCommentAnalysis(channelId: string) {
    const [data, setData] = useState<CommentsByVideo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingStage, setLoadingStage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const load = useCallback(
        async (signal?: AbortSignal) => {
            try {
                setIsLoading(true);
                setError(null);
                setLoadingStage("Fetching top videos…");

                // 1) Get top 3 videos
                const top3 = await getTop3VideosByViews(channelId, signal);
                const videoIds: string[] = top3.items.map((it) => it.id?.videoId).filter(Boolean);

                if (signal?.aborted) return;

                setLoadingStage("Fetching comments in parallel…");

                // 2) Fetch each video’s comment threads in parallel
                const threadLists = await Promise.all(
                    videoIds.map((vid) =>
                        getVideoComments(vid, signal).catch((e) => {
                            // Swallow per-video failures so others can succeed
                            console.warn(`Comments failed for ${vid}:`, e);
                            return [];
                        })
                    )
                );

                if (signal?.aborted) return;

                // 3) Build Record<string, string[]>
                const byVideo: CommentsByVideo = {};
                videoIds.forEach((vid, idx) => {
                    const threads = threadLists[idx] ?? [];
                    // Ensure the array exists before pushing
                    if (!byVideo[vid]) byVideo[vid] = [];
                    for (const t of threads) {
                        byVideo[vid].push(t.snippet.topLevelComment.snippet.textOriginal);
                    }
                });

                setData(byVideo);
                setLoadingStage("Done");
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Error message:", error.message);
                } else {
                    console.error("Unknown error:", error);
                }
            } finally {
                setIsLoading(false);
            }
        },
        [channelId]
    );

    // Run on mount / channelId change
    useEffect(() => {
        const controller = new AbortController();
        load(controller.signal);
        return () => controller.abort();
    }, [load]);

    // Optional: manual refetch
    const refetch = useCallback(() => {
        const controller = new AbortController();
        load(controller.signal);
        return () => controller.abort(); // consumer can call this cleanup if needed
    }, [load]);

    return { data, loadingStage, isLoading, error, refetch };
}

export default useYoutubeCommentAnalysis;
