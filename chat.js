let usedMessages = 0;
const FREE_LIMIT = 30;

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `msg ${sender}`;
    msg.innerText = text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    if (usedMessages >= FREE_LIMIT) {
        addMessage("⚠️ Você atingiu o limite de 30 mensagens gratuitas. Faça upgrade para continuar.", "bot");
        return;
    }

    addMessage(text, "user");
    input.value = "";
    usedMessages++;

    // LOADING
    addMessage("🔮 Processando…", "bot");
    const loading = messagesDiv.lastChild;

    // Requisição ao backend real
    try {
        const res = await fetch("https://seu-backend-aqui.com/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        const data = await res.json();
        loading.remove();
        addMessage(data.reply, "bot");

    } catch (err) {
        loading.remove();
        addMessage("❌ Erro ao conectar com a IA. Tente novamente.", "bot");
    }
}

sendBtn.onclick = sendMessage;
input.onkeypress = (e) => e.key === "Enter" && sendMessage();
