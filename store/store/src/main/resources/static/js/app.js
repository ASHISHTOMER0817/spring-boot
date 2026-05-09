/* ============================================================
   app.js — MediBot Disease Awareness Chatbot
   Concerns:
     1. API  — all backend communication
     2. Chat — message rendering & state
     3. UI   — input bar, auto-resize, typing indicator
     4. Modal / Overlay — signup form, validation
     5. Toast — lightweight notifications
     6. Init — bootstrap everything
   ============================================================ */

/* ============================================================
   1. API MODULE
   ============================================================ */
const API = (() => {
  async function sendMessage(userText) {

    let data;
      try{
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
                "message": userText
          }),
        });

        data = await response.text();
        console.log("data is here", data);

      }catch(a){
        console.log(a);
      }

    return data;
  }

  return { sendMessage };
})();

/* ============================================================
   2. CHAT MODULE
   ============================================================ */
const Chat = (() => {
  const chatWindow = document.getElementById("chatWindow");
  const welcome = document.getElementById("chatWelcome");
  let hasMessages = false;

  function _hideWelcome() {
    if (!hasMessages) {
      hasMessages = true;
      welcome.style.display = "none";
    }
  }

  function _createAvatar(role) {
    const el = document.createElement("div");
    el.className = "msg-avatar";
    el.setAttribute("aria-hidden", "true");
    el.textContent = role === "bot" ? "M" : "U";
    return el;
  }

  function _createBubble(text) {
    console.log("reached here");
    console.log("this is text: ", text);
    const el = document.createElement("div");
    el.className = "msg-bubble";
    el.textContent = text;
    return el;
  }

  function appendMessage(role, text) {
    _hideWelcome();

    const row = document.createElement("div");
    row.className = `msg-row ${role}`;

    row.appendChild(_createAvatar(role));
    row.appendChild(_createBubble(text));

    chatWindow.appendChild(row);
    _scrollToBottom();
  }

  function showTyping() {
    _hideWelcome();
    const row = document.createElement("div");
    row.className = "msg-row bot";
    row.id = "typingRow";

    const avatar = _createAvatar("bot");
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.innerHTML =
      '<div class="typing-indicator"><span></span><span></span><span></span></div>';

    row.appendChild(avatar);
    row.appendChild(bubble);
    chatWindow.appendChild(row);
    _scrollToBottom();
  }

  function removeTyping() {
    const row = document.getElementById("typingRow");
    if (row) row.remove();
  }

  function _scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  return { appendMessage, showTyping, removeTyping };
})();

/* ============================================================
   3. UI MODULE
   ============================================================ */
const UI = (() => {
  const input = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  let isLoading = false;

  function _autoResize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  }

  function getValue() {
    return input.value.trim();
  }

  function clearInput() {
    input.value = "";
    input.style.height = "auto";
    _updateSendState();
  }

  function setLoading(state) {
    isLoading = state;
    sendBtn.disabled = state || getValue() === "";
    input.disabled = state;
  }

  function _updateSendState() {
    sendBtn.disabled = isLoading || getValue() === "";
  }

  function onSend(callback) {
    // Button click
    sendBtn.addEventListener("click", () => {
      if (getValue()) callback(getValue());
    });

    // Enter key (shift+enter = newline)
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (getValue()) callback(getValue());
      }
    });

    // Auto-resize + send button state
    input.addEventListener("input", () => {
      _autoResize();
      _updateSendState();
    });
  }

  function onChipClick(callback) {
    const chips = document.getElementById("suggestionChips");
    if (!chips) return;
    chips.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (chip) callback(chip.dataset.query);
    });
  }

  return { getValue, clearInput, setLoading, onSend, onChipClick };
})();

/* ============================================================
   4. MODAL MODULE
   ============================================================ */
const Modal = (() => {
  const overlay = document.getElementById("signupOverlay");
  const openBtn = document.getElementById("openSignup");
  const closeBtn = document.getElementById("closeSignup");
  const form = document.getElementById("signupForm");

  const fields = {
    name: {
      el: document.getElementById("signupName"),
      group: document.getElementById("fg-name"),
      validate: (v) => v.trim().length >= 2,
    },
    email: {
      el: document.getElementById("signupEmail"),
      group: document.getElementById("fg-email"),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    },
    password: {
      el: document.getElementById("signupPassword"),
      group: document.getElementById("fg-password"),
      validate: (v) => v.length >= 8,
    },
  };

  function open() {
    overlay.classList.add("active");
    document.getElementById("signupName").focus();
  }

  function close() {
    overlay.classList.remove("active");
    _clearErrors();
  }

  function _clearErrors() {
    Object.values(fields).forEach(({ el, group }) => {
      el.classList.remove("error");
      group.classList.remove("has-error");
    });
  }

  function _validateAll() {
    let valid = true;
    Object.values(fields).forEach(({ el, group, validate }) => {
      if (!validate(el.value)) {
        el.classList.add("error");
        group.classList.add("has-error");
        valid = false;
      } else {
        el.classList.remove("error");
        group.classList.remove("has-error");
      }
    });
    return valid;
  }

  function _bindEvents() {
    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);

    // Close on backdrop click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("active")) close();
    });

    // Clear error on re-type
    Object.values(fields).forEach(({ el, group }) => {
      el.addEventListener("input", () => {
        el.classList.remove("error");
        group.classList.remove("has-error");
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!_validateAll()) return;

      // Simulate account creation (replace with real API call)
      const name = fields.name.el.value.trim();
      close();
      Toast.show(`Welcome, ${name}! 🎉`, "success");
      form.reset();
    });

    // "Log in" toggle (placeholder)
    document.getElementById("switchToLogin").addEventListener("click", () => {
      Toast.show("Login flow coming soon.");
    });
  }

  return { init: _bindEvents };
})();

/* ============================================================
   5. TOAST MODULE
   ============================================================ */
const Toast = (() => {
  const el = document.getElementById("toast");
  let timer;

  function show(message, type = "") {
    clearTimeout(timer);
    el.textContent = message;
    el.className = `toast ${type} show`;
    timer = setTimeout(() => {
      el.classList.remove("show");
    }, 3000);
  }

  return { show };
})();

/* ============================================================
   6. INIT — wire everything together
   ============================================================ */
(function init() {
  Modal.init();

  async function handleSend(text) {
    UI.clearInput();
    Chat.appendMessage("user", text);
    UI.setLoading(true);
    Chat.showTyping();

    try {
      const reply = await API.sendMessage(text);
      console.log("so this is reply", reply);
      Chat.removeTyping();
      Chat.appendMessage("bot", reply);
    } catch (err) {
      Chat.removeTyping();
      Chat.appendMessage(
        "bot",
        "I'm having trouble connecting right now. Please try again shortly."
      );
      console.error("[MediBot]", err.message);
    } finally {
      UI.setLoading(false);
    }
  }

  UI.onSend(handleSend);
  UI.onChipClick(handleSend);
})();
