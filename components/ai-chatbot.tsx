"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, LoaderCircle, MessageCircle, Send, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi! I'm the Quad Tech Solutions AI assistant. I'm here to help with your telecom and network infrastructure questions. How can I assist you today?",
};

const FALLBACK_ERROR =
  "I'm having trouble answering right now. Please try again in a moment, or send your question through the contact form.";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  async function sendMessage() {
    const text = inputMessage.trim();
    if (!text || isLoading) return;

    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, { id: `${Date.now()}-user`, role: "user", content: text }]);
    setInputMessage("");
    setIsLoading(true);

    let reply = FALLBACK_ERROR;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationHistory: history }),
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (response.ok && data.message) {
        reply = data.message;
      } else if (data.error) {
        reply = data.error;
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-assistant`, role: "assistant", content: reply },
      ]);
      setIsLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50">
        <Button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close the site assistant" : "Chat with the site assistant"}
          size="icon"
          className="size-14 animate-in rounded-full bg-gradient-to-r from-brand to-accent text-white shadow-lg transition-opacity duration-300 zoom-in hover:opacity-90"
        >
          {isOpen ? (
            <X className="size-6" aria-hidden />
          ) : (
            <span className="relative" aria-hidden>
              <MessageCircle className="size-6" />
              <span className="absolute -top-1 -right-1 size-3 animate-pulse rounded-full bg-green-500" />
            </span>
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed right-6 bottom-24 z-40 w-96 max-w-[calc(100vw-3rem)] animate-in duration-200 fade-in slide-in-from-bottom-2">
          <Card className="flex h-[min(500px,calc(100dvh-8rem))] flex-col gap-0 bg-card/95 py-0 shadow-2xl backdrop-blur">
            <CardHeader className="border-b py-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="size-5 text-accent" aria-hidden />
                <span>AI Network Consultant</span>
                <span className="ml-auto flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
                  <span className="size-2 rounded-full bg-green-500" aria-hidden />
                  Online
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col p-0">
              <div
                className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4"
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex animate-in duration-300 fade-in slide-in-from-bottom-1 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[80%] items-start gap-2 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                          message.role === "user"
                            ? "bg-accent text-accent-foreground"
                            : "bg-primary/20 text-accent"
                        }`}
                        aria-hidden
                      >
                        {message.role === "user" ? (
                          <User className="size-4" />
                        ) : (
                          <Bot className="size-4" />
                        )}
                      </span>
                      <p
                        className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                          message.role === "user"
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex animate-in justify-start duration-300 fade-in">
                    <div className="flex items-start gap-2">
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-accent"
                        aria-hidden
                      >
                        <Bot className="size-4" />
                      </span>
                      <span className="rounded-lg bg-muted px-3 py-2">
                        <LoaderCircle
                          className="size-4 animate-spin text-accent"
                          aria-label="Waiting for a reply"
                        />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(event) => setInputMessage(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about network solutions..."
                    aria-label="Your message"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => void sendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    aria-label="Send message"
                  >
                    <Send className="size-4" aria-hidden />
                  </Button>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Powered by AI • For complex projects, contact our experts directly
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
