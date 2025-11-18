import React from "react";

import useYoutubeCommentAnalysis from "../../hooks/useYoutubeCommentAnalysis";

import Spinner from "react-bootstrap/Spinner";

const SummaryBox: React.FC = () => {
    const { data, loadingStage, error } = useYoutubeCommentAnalysis("UCMNEVbszv8ZyvSXoTn3yhpQ");

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
