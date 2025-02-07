import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Mic, PaperclipIcon, Menu } from 'lucide-react';
import { createRoot } from "react-dom/client";
import "./styles.css";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    role: "assistant",
    content: "Hello! I'm Nebius AI Chatbot. How can I assist you today?"
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      setIsLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      if (!response.ok) throw new Error("Network error");
      const aiText = await response.text();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: aiText }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (userQuestion: string, streamingAnswer: string) => {
    if (isLoading) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: userQuestion };
    setMessages(prev => [...prev, userMsg]);

    setIsLoading(true);
    const assistantMsgId = Date.now() + 1;
    setMessages(prev => [...prev, { id: assistantMsgId, role: "assistant", content: "" }]);

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      setMessages(prev => prev.map(msg => {
        if (msg.id === assistantMsgId) {
          return { ...msg, content: streamingAnswer.substring(0, currentIndex) };
        }
        return msg;
      }));
      if (currentIndex >= streamingAnswer.length) {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 25);
  };

  return (
    <div className="chat-container">
      <header className="navbar">
        <div className="nav-left">
          {/* <Menu className="menu-icon" size={24} /> */}
          <span className="logo">◆</span>
          <h1>Nebius x Hono Chatbot</h1>
        </div>
        <div className="nav-right">
          {/* <button className="deploy-btn">
            <span className="triangle">▲</span>
            Check out Nebius 
          </button> */}
          <a
            className="login-btn"
            href="https://github.com/Arindam200/nebius-hono"
            target="_blank"
            rel="noopener noreferrer"
          >
            Star the Repo ⭐️
          </a>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.role === "assistant" && (
              <div className="icon-wrapper assistant">
                <Bot className="icon" size={20} />
              </div>
            )}
            <div className="content">
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="icon-wrapper user">
                <User className="icon" size={20} />
              </div>
            )}
          </div>
        ))}
        {isLoading && <div className="loading">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="suggested-prompts">
        <button 
          className="prompt-btn"
          onClick={() => handleSuggestedPrompt(
            "What is Nebius AI Studio? Give me some details about it",
            "Nebius AI Studio is an innovative platform that leverages advanced AI and a collaborative workspace to empower developers. It provides state-of-the-art tools and services for creative problem solving."
          )}
        >
          What is Nebius AI Studio? <br />
          Give me a some deatils about it
        </button>
        <button 
          className="prompt-btn"
          onClick={() => handleSuggestedPrompt(
            "What is the status of flight BA142 flying tmrw?",
            "Flight BA142 is scheduled to depart on time. However, delays may occur due to weather conditions or technical issues, so please check with the airline for the latest information."
          )}
        >
          What is the status <br />
          of flight BA142 flying tomorrow?
        </button>
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message..."
        />
        <div className="input-icons">
          <button type="button" className="icon-btn">
            <PaperclipIcon size={20} />
          </button>
          <button type="submit" disabled={isLoading} className="icon-btn send">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

function App() {
  return <Chat />;
}

document.addEventListener('DOMContentLoaded', () => {
  const domNode = document.getElementById("root");
  if (!domNode) {
    throw new Error("Failed to find the root element");
  }
  const root = createRoot(domNode);
  root.render(<App />);
});
