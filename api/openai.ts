import OpenAI from "openai";

const handler = async (req, res) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OpenAI_API_KEY,
        });

        const { prompt } = req.body;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
        });
        res.status(200).json({
            response: completion.choices[0].message.content,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export default handler;
