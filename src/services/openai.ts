export async function analyzeComments(commentsByVideoId: Record<string, string[]>, signal?: AbortSignal) {
    const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            commentsByVideoId,
        }),
        signal,
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to analyze comments' }));
        throw new Error(error.error || 'Failed to analyze comments');
    }
    
    const data = await res.json();
    return data.response;
}
