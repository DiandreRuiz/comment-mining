import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { searchYouTubeChannels } from "../services/googleApiYoutube";

type YTChannelSearchItem = {
    id: { kind: string; channelId?: string };
    snippet: { title: string; description: string; thumbnails: Record<string, { url: string }> };
};

type UseYouTubeResultsReturn = [
    Dispatch<SetStateAction<string>>, // setQuery
    Dispatch<SetStateAction<string | null>>, // setSelectedChannelId
    YTChannelSearchItem[],                // results
    boolean,                              // isLoading
    string | null,                        // error
    string,                               // query
    string | null                         // selectedChannelId
];

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_DELAY = 500;

export const useYouTubeResults = () => {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<YTChannelSearchItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

    useEffect(() => {
        if (query.length < MIN_QUERY_LENGTH) {
            setResults([]);
            return;
        }

        const abortController = new AbortController();
        const signal = abortController.signal;

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await searchYouTubeChannels(query, signal);
                setResults(res.items || []);
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    console.error("Search aborted:", error.message);
                }
            } finally {
                setIsLoading(false);
            }
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(timeoutId);
            abortController.abort();
        };
    }, [query]);

    return [setQuery, setSelectedChannelId, results, isLoading, error, query, selectedChannelId] as UseYouTubeResultsReturn;
};
