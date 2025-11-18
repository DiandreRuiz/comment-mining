import React from "react";
import useYoutubeCommentAnalysis from "../../hooks/useYoutubeCommentAnalysis";
import Spinner from "react-bootstrap/Spinner";

interface SummaryBoxProps {
    channelId: string | null;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ channelId }) => {
    const { data, loadingStage, error } = useYoutubeCommentAnalysis(channelId);
    
    // Don't show anything if no channel is selected
    if (!channelId) {
        return null;
    }

    if (error) {
        return <p>Error: {String(error)}</p>;
    }

    if (loadingStage !== "Done") {
        return (
            <>
                <h1>{loadingStage}</h1>
                <Spinner />
            </>
        );
    }

    if (data) {
        return <p>{data}</p>;
    }

    return null;
};

export default SummaryBox;
