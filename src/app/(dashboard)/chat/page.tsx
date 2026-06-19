"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI nutrition assistant. I can help you with meal planning, nutrition advice, recipe ideas, and health questions. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await axios.post("/api/chat", {
        message: userMessage,
        sessionId,
      });
      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What foods are high in protein?",
    "How can I reduce sugar cravings?",
    "Give me a healthy breakfast idea",
    "How much water should I drink daily?",
  ];

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">AI Nutrition Assistant</h1>
        <p className="text-gray-500 mt-1">Get personalized nutrition advice powered by AI</p>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-green-500 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                )}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); }}
                className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 hover:bg-green-100"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about nutrition, recipes, or health goals..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-green-500 text-white p-2.5 rounded-xl hover:bg-green-600 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
