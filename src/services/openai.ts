import axios from "axios";

export async function analyzeComments(commentsByVideoId: Record<string, string[]>) {
    let allComments: string[] = [];
    for (const videoId in commentsByVideoId) {
        const currentVideosComments = commentsByVideoId[videoId];
        allComments = [...allComments, ...currentVideosComments];
    }
    try {
        const response = axios.get()
    }
}
