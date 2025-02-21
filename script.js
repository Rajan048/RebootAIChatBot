const API_KEY = "AIzaSyDWXYRrl6cROb_LAMu4rgCpjjWcyhCIiVo"; // Replace with your Gemini API Key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    addMessage("You", userInput, "user-message");
    document.getElementById("user-input").value = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userInput }] }]
            })
        });

        const data = await response.json();
        console.log("API Response:", data);

        let geminiResponse = "⚠ AI did not return a response.";
        if (data?.candidates?.length > 0) {
            geminiResponse = data.candidates[0]?.content?.parts?.[0]?.text || geminiResponse;
        }

        // Format response as a code block if applicable
        if (userInput.toLowerCase().includes("code") || userInput.toLowerCase().includes("program")) {
            geminiResponse = `<pre><code>${escapeHTML(geminiResponse)}</code></pre>`;
        }

        addMessage("Gemini", geminiResponse, "bot-message");
    } catch (error) {
        addMessage("Gemini", "❌ Error: Unable to reach AI.", "bot-message");
        console.error("API Error:", error);
    }
}

function addMessage(sender, message, className) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
    document.getElementById("chat-box").innerHTML = "";
}

// Escape HTML characters to prevent formatting issues
function escapeHTML(text) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Dark Mode Toggle
document.getElementById("theme-toggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");
});
