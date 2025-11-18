export default async function handler(req: any, res: any) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action, ...params } = req.body;

    if (!action) {
        return res.status(400).json({ error: 'Missing action parameter' });
    }

    const apiKey = process.env.YT_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    try {
        let url: string;
        const searchParams = new URLSearchParams({
            ...params,
            key: apiKey,
        });

        switch (action) {
            case 'searchChannels': {
                searchParams.append('part', 'snippet');
                searchParams.append('type', 'channel');
                url = `https://www.googleapis.com/youtube/v3/search?${searchParams}`;
                break;
            }
            case 'getTopVideos': {
                searchParams.append('part', 'id');
                searchParams.append('type', 'video');
                searchParams.append('order', 'viewCount');
                searchParams.append('maxResults', '3');
                url = `https://www.googleapis.com/youtube/v3/search?${searchParams}`;
                break;
            }
            case 'getVideoComments': {
                searchParams.append('part', 'snippet');
                searchParams.append('maxResults', '100');
                searchParams.append('order', 'relevance');
                searchParams.append('textFormat', 'plainText');
                url = `https://www.googleapis.com/youtube/v3/commentThreads?${searchParams}`;
                break;
            }
            default:
                return res.status(400).json({ error: `Unknown action: ${action}` });
        }

        const response = await fetch(url);
        
        if (!response.ok) {
            let errorMessage = 'Failed to fetch from YouTube API';
            try {
                const errorData = await response.json();
                if (errorData?.error?.message) {
                    errorMessage = errorData.error.message;
                }
            } catch {
                // Ignore JSON parse errors
            }
            return res.status(response.status).json({ error: errorMessage });
        }

        const data = await response.json();
        
        // For comment threads, return items array directly
        if (action === 'getVideoComments') {
            return res.status(200).json({ items: data.items || [] });
        }
        
        return res.status(200).json(data);
    } catch (error: any) {
        console.error('YouTube API error:', error);
        return res.status(500).json({ 
            error: error.message || 'Internal server error' 
        });
    }
}

