export interface YouTubeCommentThreadItem {
    id: string;
    snippet: {
        topLevelComment: {
            snippet: {
                textOriginal: string;
                authorDisplayName: string;
                likeCount: number;
                publishedAt: string;
            };
        };
    };
}

export type YouTubeSearchItem = {
    kind: "youtube#searchResult";
    etag: string;
    id: {
        kind: "youtube#video";
        videoId: string;
    };
};

export type YouTubeSearchResponse = {
    items: YouTubeSearchItem[];
};

// services/youtubeService.ts
export async function searchYouTubeChannels(query: string, signal?: AbortSignal) {
    const params = new URLSearchParams({
        part: "snippet",
        type: "channel",
        q: query,
        key: import.meta.env.VITE_YT_API_KEY,
    });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, { signal });
    if (!res.ok) throw new Error("Failed to fetch channels");
    return res.json();
}

export async function getTop3VideosByViews(channelId: string, signal?: AbortSignal): Promise<YouTubeSearchResponse> {
    const params = new URLSearchParams({
        part: "id",
        type: "video",
        channelId: channelId.toString(),
        order: "viewCount",
        maxResults: "3",
        key: import.meta.env.VITE_YT_API_KEY,
    });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, { signal });
    if (!res.ok) {
        throw new Error("Failed to fetch videos");
    }
    return res.json();
}

export async function getVideoComments(videoId: string, signal?: AbortSignal): Promise<YouTubeCommentThreadItem> {
    const params = new URLSearchParams({
        part: "snippet",
        videoId,
        maxResults: "50",
        order: "relevance", // or "time"
        textFormat: "plainText",
        key: import.meta.env.VITE_YT_API_KEY,
    });

    // We need to handle if a YouTube video has comments disabled gracefully!

    const res = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?${params}`, { signal });
    // If the response failed, read and inspect the error body
    if (!res.ok) {
        let message = "Failed to fetch comments";
        try {
            const data = await res.json();
            if (data?.error?.message) {
                message = data.error.message; // grab the detailed YouTube message
            }
        } catch {
            // ignore JSON parse errors, stick with default message
        }
        throw new Error(message);
    }

    const data = await res.json();
    return data.items;
}
