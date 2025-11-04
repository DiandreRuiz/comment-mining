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

export async function getTop3VideosByViews(channelId: string, signal?: AbortSignal) {
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

export async function getTopCommentsForVideosByVideoId
