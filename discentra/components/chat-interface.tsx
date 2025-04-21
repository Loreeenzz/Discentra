"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

// Sample responses for demo purposes
const sampleResponses: Record<string, string> = {
  earthquake:
    "During an earthquake: DROP to the ground, COVER your head and neck, and HOLD ON to sturdy furniture. Stay away from windows and exterior walls. If you're outside, move to an open area away from buildings and power lines.",
  fire: "In case of fire: If possible, evacuate immediately. Stay low to avoid smoke inhalation. Feel doors before opening - if hot, find another exit. If trapped, seal doors and vents with wet cloth and signal for help from windows.",
  flood:
    "During a flood: Move to higher ground immediately. Avoid walking or driving through flood waters - just 6 inches of moving water can knock you down, and 12 inches can sweep away a vehicle.",
  hurricane:
    "For hurricane preparation: Secure your home, create an emergency kit with food, water, and medications for at least 3 days. Follow evacuation orders, and if sheltering in place, stay in a small interior room away from windows.",
  tornado:
    "During a tornado: Seek shelter in a basement or interior room on the lowest floor. Stay away from windows and cover yourself with blankets or a mattress. If outside, lie flat in a nearby ditch or depression.",
  default:
    "I'm your AI Disaster Assistant. I can provide guidance on what to do during various emergencies like earthquakes, fires, floods, hurricanes, and tornadoes. How can I help you today?",
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI Disaster Assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);

    // Simulate voice recording for 3 seconds
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInput("What should I do during an earthquake?");
      }, 3000);
    }
  };

  // Simple response generator for demo
  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("earthquake")) {
      return sampleResponses.earthquake;
    } else if (lowerQuery.includes("fire")) {
      return sampleResponses.fire;
    } else if (lowerQuery.includes("flood")) {
      return sampleResponses.flood;
    } else if (lowerQuery.includes("hurricane")) {
      return sampleResponses.hurricane;
    } else if (lowerQuery.includes("tornado")) {
      return sampleResponses.tornado;
    } else {
      return sampleResponses.default;
    }
  };

  return (
    <Card className="w-full overflow-hidden border-2">
      <CardContent className="p-0">
        <div className="flex flex-col h-[500px]">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                  flex gap-3 max-w-[80%]
                  ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}
                `}
                >
                  <Avatar
                    className={
                      message.sender === "ai"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "bg-gray-100 dark:bg-gray-800"
                    }
                  >
                    <AvatarFallback>
                      {message.sender === "ai" ? (
                        <Bot className="h-5 w-5 text-blue-500" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`
                    rounded-lg p-3
                    ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }
                  `}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* AI typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="bg-blue-100 dark:bg-blue-900">
                    <AvatarFallback>
                      <Bot className="h-5 w-5 text-blue-500" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t p-3">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about disaster preparedness or emergency response..."
                className="min-h-[80px] pr-24 resize-none"
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={`${
                    isRecording ? "text-red-500 animate-pulse" : ""
                  }`}
                  onClick={toggleRecording}
                  aria-label="Record voice input"
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Try asking: "What should I do during an earthquake?" or "How to
              prepare for a hurricane?"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
