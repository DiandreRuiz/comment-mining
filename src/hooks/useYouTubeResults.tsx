import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { searchYouTubeChannels } from "../services/googleApiYoutube";

type YTChannelSearchItem = {
    id: { kind: string; channelId?: string };
    snippet: { title: string; description: string; thumbnails: Record<string, { url: string }> };
};

type UseYouTubeResultsReturn = [
    Dispatch<SetStateAction<string>>, // setQuery
    YTChannelSearchItem[],            // results
    boolean,                          // isLoading
    string | null,                    // error
    string                            // query
  ];

const MIN_QUERY_LENGTH = 3;

export const useYouTubeResults = () => {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<YTChannelSearchItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (query.length < MIN_QUERY_LENGTH) return;
        setIsLoading(true);
        const getResult = async () => {
            try {
                const res = await searchYouTubeChannels(query);
                setResults(res.items || []);
                setIsLoading(false);
                console.log("results", res);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(String(error));
                }
                setIsLoading(false);
            }
        };
        getResult();
    }, [query]);

    return [setQuery, results, isLoading, error, query] as UseYouTubeResultsReturn;
};
