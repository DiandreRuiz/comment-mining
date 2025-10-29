import { google } from "googleapis";

const YOUTUBE_API_CLIENT = google.youtube({
    version: "v3",
    auth: import.meta.env.VITE_YT_API_KEY,
});

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

export async function getYoutubeChannelComments(videoId: string) {
    const res = await YOUTUBE_API_CLIENT.commentThreads.list({
        params: {
            part: "snippet",
            videoId,
        },
    });
    return res.data;
}
