import { useState, useEffect } from "react";
import { getTop3VideosByViews, getVideoComments } from "../services/googleApiYoutube";
import type { YouTubeCommentThreadItem } from "../services/googleApiYoutube";

export const useYoutubeCommentAnalysis = (channelId: string) => {
    const [loadingStage, setLoadingStage] = useState<string | null>(null);
    useEffect(() => {
        const getAllComments = async () => {
            const top3VideoIds = await getTop3VideosByViews(channelId);
            let comments: YouTubeCommentThreadItem[] = [];
            for (const item of top3VideoIds.items) {
                const c = await getVideoComments(item.id.videoId);
                comments = [...comments, c];
            }
        };
    });
};

export default useYoutubeCommentAnalysisHook;
