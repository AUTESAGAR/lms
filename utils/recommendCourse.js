import courses from "../data/instituteData.js";

const recommendCourse = (message) => {
    const userMessage = message.toLowerCase();
    // AI
    if (
        userMessage.includes("ai") ||
        userMessage.includes("machine learning") ||
        userMessage.includes("artificial intelligence")
    ) {
        return courses.find(course =>
            course.title === "Artificial Intelligence"
        );
    }
    // Web Development
    if (
        userMessage.includes("web") ||
        userMessage.includes("mern") ||
        userMessage.includes("react") ||
        userMessage.includes("fullstack")
    ) {
        return courses.find(course =>
            course.title === "MERN Fullstack"
        );
    }
    // Python
    if (
        userMessage.includes("python") ||
        userMessage.includes("django")
    ) {
        return courses.find(course =>
            course.title === "Python Fullstack"
        );
    }
    return null;
}

export default recommendCourse;