import { useState, useEffect } from "react";
import { getTop3VideosByViews } from "../services/googleApiYoutube";

export const useYoutubeCommentAnalysis = (channelId: string) => {
    const [loadingStage, setLoadingStage] = useState<string | null>(null);

    const getTop3Videos = async () => {
        setLoadingStage("getTopVideos");
        const top3YoutubeVideos = await getTop3VideosByViews(channelId);
    };

    const getComments = async () => {
        
    }
};

export default useYoutubeCommentAnalysisHook;
