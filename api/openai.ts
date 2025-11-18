import OpenAI from "openai";

export default async function handler(req: any, res: any) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    try {
        const openai = new OpenAI({
            apiKey: apiKey,
        });

        const { commentsByVideoId, prompt } = req.body;

        // If commentsByVideoId is provided, use it to build the prompt
        let finalPrompt = prompt;
        if (commentsByVideoId && !prompt) {
            let allComments: string[] = [];
            for (const videoId in commentsByVideoId) {
                const currentVideosComments = commentsByVideoId[videoId];
                allComments = [...allComments, ...currentVideosComments];
            }

            finalPrompt =
                "You are analyzing YouTube comments to infer why a channel is successful.\n" +
                "- Some comments may be low-signal; discount them.\n" +
                "- If evidence is insufficient, say so explicitly.\n" +
                "- Write a concise, natural-language explanation.\n\n" +
                "- Make sure to stay away from vague language. Quote specific instances of comments whenever possible.\n\n" +
                `Comments:\n${allComments.join("\n")}`;
        }

        if (!finalPrompt) {
            return res.status(400).json({ error: "Missing prompt or commentsByVideoId" });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: finalPrompt }],
        });

        return res.status(200).json({
            response: completion.choices[0].message.content,
        });
    } catch (error: any) {
        console.error("OpenAI API error:", error);

        // Handle specific OpenAI errors
        if (error.status === 401) {
            return res.status(401).json({ error: "Authentication failed. Check OPENAI_API_KEY." });
        }
        if (error.status === 429) {
            return res.status(429).json({ error: "Rate limit exceeded. Please retry later." });
        }

        return res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
}
