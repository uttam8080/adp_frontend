import React, { useState } from "react";
import "./ChatBot.css";

/**
 * Floating chat widget that can be hooked up to an AI backend.
 * It displays a toggle button, a list of messages and a textarea for input.
 * Currently replies with a mock response – replace the setTimeout with a real API call.
 */
export const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([
    { from: "bot", text: "Hi! I’m Antigravity, your hotel assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const toggleOpen = () => setOpen(!open);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    // TODO: Replace this mock with a fetch call to your AI endpoint
    setTimeout(() => {
      const botReply = { from: "bot", text: "I’m still a mock, but I’ll forward your request soon!" };
      setMessages((prev) => [...prev, botReply]);
    }, 500);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleOpen} aria-label={open ? "Close chat" : "Open chat"}>
        {open ? "×" : "💬"}
      </button>
      {open && (
        <div className="chatbot-window" role="dialog" aria-modal="false">
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message chatbot-${msg.from}`}> {msg.text} </div>
            ))}
          </div>
          <textarea
            className="chatbot-input"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="chatbot-send" onClick={handleSend}>Send</button>
        </div>
      )}
    </div>
  );
};
