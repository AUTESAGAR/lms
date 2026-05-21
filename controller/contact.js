import askGemini from "../services/geminiService.js";
import recommendCourse from "../utils/recommendCourse.js";

export const contact = async (req, res) => {
    res.render("contact",{userData:""});
};

// export const chatbotReply = async (req, res) => {
//     try {
//         const { message } = req.body;
//         const reply = await askGemini(message);
//         res.json({success: true,reply});
//     } catch (error) {
//         console.log(error);
//         res.json({success: false,reply: "AI Not Available."});
//     }
// }


export const chatbotReply = async (req, res) => {

    try {

        const { message } = req.body;

        const recommendedCourse = recommendCourse(message);

        let recommendationText = "";

        if (recommendedCourse) {

            recommendationText = `

            Recommended Course:
            ${recommendedCourse.title}

            Fees:
            ${recommendedCourse.fees}

            Duration:
            ${recommendedCourse.duration}

            Mode:
            ${recommendedCourse.mode}

            Career Opportunities:
            ${recommendedCourse.career.join(", ")}

            `;
        }

        const finalPrompt = `

        You are AI assistant of VIT Technology Solution.

        ${recommendationText}

        Student Question:
        ${message}

        Answer professionally.

        `;

        const response = await askGemini(finalPrompt);

        res.json({
            success: true,
            reply: response
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            reply: "Something went wrong"
        });

    }

}