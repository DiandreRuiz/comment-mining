import { useState, useEffect } from "react";
import { getTop3VideosByViews, getVideoComments } from "../services/googleApiYoutube";

export const useYoutubeCommentAnalysis = (channelId: string) => {
    const [loadingStage, setLoadingStage] = useState<string | null>(null);
    useEffect(() => {
        const getComments = async () => {
            const top3VideoIds = await getTop3VideosByViews(channelId);
            const comments = [];
            top3VideoIds.forEach((element) => {});
        };
    });
};

export default useYoutubeCommentAnalysisHook;
