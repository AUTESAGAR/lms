import axios from "axios";
const askGemini = async (message) => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: message
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.log("GEMINI ERROR =>");
        console.log(error.response?.data || error.message);
        return "AI Assistant is temporarily unavailable.";
    }
}

export default askGemini;