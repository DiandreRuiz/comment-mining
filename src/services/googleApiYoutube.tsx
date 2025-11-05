interface YouTubeCommentThreadItem {
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

// services/youtubeService.ts
export async function getVideoComments(videoId: string, signal?: AbortSignal) {
    const params = new URLSearchParams({
        part: "snippet",
        videoId,
        maxResults: "50",
        order: "relevance", // or "time"
        textFormat: "plainText",
        key: import.meta.env.VITE_YT_API_KEY,
    });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?${params}`, { signal });
    if (!res.ok) throw new Error("Failed to fetch comments");

    const data = await res.json();
    return data.items.map((item: YouTubeCommentThreadItem) => ({
        id: item.id,
        text: item.snippet.topLevelComment.snippet.textOriginal,
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        likeCount: item.snippet.topLevelComment.snippet.likeCount,
        publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
    }));
}
