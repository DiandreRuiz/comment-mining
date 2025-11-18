import { useState } from "react";

// We can break down comment analysis by video in the future but for
// now we aggregate all results to an overall analysis of the channel

const useOpenAI = (allComments: string[]): string => {
    const [data, setData] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);

    

    return "Hello";
};
