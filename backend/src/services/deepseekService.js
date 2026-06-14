import OpenAI from "openai"

const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com"
})

export const getAIResponse = async (message) => {
    const response = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
            {
                role: "system",
                content:
                    "You are UniBot, an AI assistant for university students."
            },
            {
                role: "user",
                content: message
            }
        ]
    })

    return response.choices[0].message.content
}