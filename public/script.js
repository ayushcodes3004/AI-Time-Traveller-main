const character = localStorage.getItem("selectedCharacter");
document.getElementById("characterName").textContent = `You are now talking to ${character}`;

const chatForm = document.getElementById("chatForm");
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

let conversation = [];

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("You", message);
  input.value = "";

  const typingMsg = appendTypingIndicator(character);

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, character }),
    });

    const data = await res.json();
    chatBox.removeChild(typingMsg);
    appendMessage(character, data.reply);
  } catch (err) {
    chatBox.removeChild(typingMsg);
    appendMessage(character, "❌ Something went wrong with Gemini.");
  }
});

function renderChat() {
  chatBox.innerHTML = "";
  for (const msg of conversation) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
    chatBox.appendChild(div);
  }
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendTypingIndicator(sender) {
  const typing = document.createElement("div");
  typing.classList.add("message", "typing");
  typing.innerHTML = `<em>${sender} is typing...</em>`;
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
  return typing;
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message");

  const isUser = sender === "You";
  const imgSrc = isUser ? "images/user.png" : `images/${character.toLowerCase().replace(/ /g, "-")}.jpg`;

  msg.innerHTML = `
    <div style="display: flex; align-items: flex-start; margin: 10px; ${isUser ? 'justify-content: flex-end;' : ''}">
      ${!isUser ? `<img src="${imgSrc}" class="avatar" style="margin-right: 10px;" onerror="this.src='images/cleopatra.jpg'" />` : ''}
      <div class="bubble ${isUser ? 'user' : 'bot'}">
        <strong>${sender}:</strong> ${text}
      </div>
      ${isUser ? `<img src="images/user.png" class="avatar" style="margin-left: 10px;" />` : ''}
    </div>
  `;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}





