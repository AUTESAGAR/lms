const chatBody = document.getElementById("chatBody");

async function sendMessage() {

    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();
    if (!message) return;

    // USER MESSAGE
    const userDiv = document.createElement("div");
    userDiv.className = "user-message";
    userDiv.innerHTML = `<div class="message-content">${message}</div>`;
    chatBody.appendChild(userDiv);
    messageInput.value = "";
    scrollBottom();

    // TYPING ANIMATION
    const typingDiv = document.createElement("div");
    typingDiv.className = "bot-message typing-animation";
    typingDiv.id = "typing";
    typingDiv.innerHTML = `
        <span></span>
        <span></span>
        <span></span>`;

    chatBody.appendChild(typingDiv);
    scrollBottom();

    try {
        const response = await fetch("/chatbot", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message})
        });
        const data = await response.json();
        document.getElementById("typing").remove();
        // BOT MESSAGE
        const botDiv = document.createElement("div");
        botDiv.className = "bot-message";
        botDiv.innerHTML = formatBotResponse(data.reply);
        chatBody.appendChild(botDiv);
        scrollBottom();
    } catch (error) {
        document.getElementById("typing").remove();
        const errorDiv = document.createElement("div");
        errorDiv.className = "bot-message";
        errorDiv.innerHTML = `<div class="error-text">AI assistant unavailable.</div>`;
        chatBody.appendChild(errorDiv);
    }
}

function formatBotResponse(text) {

    return text

        .replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>')

        .replace(/\*(.*?)\*/g, '<li>$1</li>')

        .replace(/\n/g, "<br>");

}

function scrollBottom() {

    chatBody.scrollTop = chatBody.scrollHeight;

}