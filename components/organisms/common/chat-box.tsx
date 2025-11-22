"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import { X, MessageCircle, Send, Bot, Sparkles } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { useCreateMessageMutation } from "@/hooks/mutations/chat";

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: "user" | "ai"; timestamp: Date }>>([
    {
      id: 1,
      text: "Xin chào! Tôi là AI trợ lý của AgriNet. Tôi có thể giúp bạn tìm kiếm thông tin về nông sản, giá cả, hoặc hỗ trợ bạn trong việc kết nối với nông dân và thương lái. Bạn cần hỗ trợ gì?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const createMessageMutation = useCreateMessageMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping || createMessageMutation.isPending) return;

    const userMessage = inputValue.trim();
    const newMessage = {
      id: messages.length + 1,
      text: userMessage,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const payload = {
        message: userMessage,
        ...(sessionId && { session_id: sessionId }),
      };

      const response = await createMessageMutation.mutateAsync(payload);

      if (response.session_id) {
        setSessionId(response.session_id);
      }

      let responseText: string;
      if (typeof response.response === "string") {
        responseText = response.response;
      } else if (typeof response.response === "object" && response.response !== null) {
        try {
          const obj = response.response as any;
          if (obj.product || obj.region || obj.market_price !== undefined) {
            responseText = `📊 Thông tin dự báo:\n\n`;
            if (obj.product) responseText += `🌾 Sản phẩm: ${obj.product}\n`;
            if (obj.region) responseText += `📍 Khu vực: ${obj.region}\n`;
            if (obj.market_price !== undefined) responseText += `💰 Giá thị trường: ${obj.market_price.toLocaleString("vi-VN")} VND\n`;
            if (obj.predicted_price !== undefined) responseText += `🔮 Giá dự báo: ${obj.predicted_price.toLocaleString("vi-VN")} VND\n`;
            if (obj.suggested_price !== undefined) responseText += `💡 Giá đề xuất: ${obj.suggested_price.toLocaleString("vi-VN")} VND\n`;
          } else {
            responseText = JSON.stringify(response.response, null, 2);
          }
        } catch {
          responseText = String(response.response);
        }
      } else {
        responseText = String(response.response || "");
      }

      const aiResponse = {
        id: messages.length + 2,
        text: responseText,
        sender: "ai" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse = {
        id: messages.length + 2,
        text: "Xin lỗi, tôi không thể xử lý câu hỏi của bạn lúc này. Vui lòng thử lại sau.",
        sender: "ai" as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 h-[600px] w-[400px] rounded-2xl border border-green-200/50 bg-white shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-green-100 bg-gradient-to-br from-green-500 via-green-600 to-green-700 px-5 py-4 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30">
                <Bot className="h-6 w-6 text-white" />
                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-400 border-2 border-white">
                  <Sparkles className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-base">AI Trợ lý AgriNet</h3>
                <p className="text-xs text-white/90 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse"></span>
                  Đang trực tuyến
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                {message.sender === "ai" && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                {message.sender === "user" && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm">
                    <span className="text-xs font-bold text-white">U</span>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
                    message.sender === "user"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-tr-sm"
                      : "bg-white border border-green-100 text-gray-800 rounded-tl-sm"
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p className={cn(
                    "text-xs mt-2",
                    message.sender === "user" ? "text-white/70" : "text-gray-400"
                  )}>
                    {message.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-green-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-green-100 p-4 bg-white">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi của bạn..."
                  disabled={isTyping || createMessageMutation.isPending}
                  className="pr-10 border-green-200 focus:border-green-400 focus:ring-green-400 rounded-xl"
                />
                {inputValue && (
                  <button
                    onClick={() => setInputValue("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping || createMessageMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl h-10 w-10"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              AI có thể mắc lỗi. Vui lòng kiểm tra thông tin quan trọng.
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full shadow-2xl transition-all duration-300",
          "bg-gradient-to-br from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800",
          "hover:scale-110 hover:shadow-green-500/50",
          isOpen && "rotate-90"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-7 w-7 text-white" />
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 border-2 border-white">
              <span className="text-[8px] font-bold text-white">1</span>
            </div>
          </div>
        )}
      </Button>
    </div>
  );
}

