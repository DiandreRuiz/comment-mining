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
    const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'searchChannels',
            q: query,
        }),
        signal,
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to fetch channels' }));
        throw new Error(error.error || 'Failed to fetch channels');
    }
    
    return res.json();
}

export async function getTop3VideosByViews(channelId: string, signal?: AbortSignal): Promise<YouTubeSearchResponse> {
    const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'getTopVideos',
            channelId: channelId.toString(),
        }),
        signal,
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to fetch videos' }));
        throw new Error(error.error || 'Failed to fetch videos');
    }
    
    return res.json();
}

export async function getVideoComments(videoId: string, signal?: AbortSignal): Promise<YouTubeCommentThreadItem[]> {
    // We need to handle if a YouTube video has comments disabled gracefully!
    // We will also need to make sure we get a big sample size of comments so that
    // the LLM can recognize useless comments. Maybe we can sort by likes?

    const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'getVideoComments',
            videoId,
        }),
        signal,
    });
    
    // If the response failed, read and inspect the error body
    if (!res.ok) {
        let message = "Failed to fetch comments";
        try {
            const data = await res.json();
            if (data?.error) {
                message = data.error; // grab the detailed error message
            }
        } catch {
            // ignore JSON parse errors, stick with default message
        }
        throw new Error(message);
    }

    const data = await res.json();
    return data.items || [];
}
