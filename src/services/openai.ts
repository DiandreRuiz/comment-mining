export async function analyzeComments(commentsByVideoId: Record<string, string[]>) {
    let allComments: string[] = [];
    for (const videoId in commentsByVideoId) {
        const currentVideosComments = commentsByVideoId[videoId];
        allComments = [...allComments, ...currentVideosComments];
    }
    const 
}
