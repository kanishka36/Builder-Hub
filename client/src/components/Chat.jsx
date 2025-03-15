import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Send, MessageSquare, User } from "lucide-react";

const socket = io("http://localhost:5000");

const Chat = ({ userId, receiverId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userId && receiverId) {
      socket.emit("join", { userId, receiverId }); // Send user ID and receiverId to server
      console.log("Emitting join event with:", { userId, receiverId });
    }

    // Listen for chat history
    socket.on("chatHistory", (chatHistory) => {
      setMessages(chatHistory)
    })

    // Listen for messages
    socket.on("receiveMessage", (data) => {
      if (data.senderId === receiverId || data.receiverId === receiverId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
    };
  }, [userId, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        senderId: userId,
        receiverId,
        message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      socket.emit("sendMessage", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]); // Show sent message immediately
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <MessageSquare className="mr-2 h-6 w-6" />
        <div className="flex-1">
          <h2 className="font-semibold">Direct Chat</h2>
          <p className="text-sm opacity-90">Chat with your seller</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.senderId === userId
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {msg.senderId !== userId && <User className="h-4 w-4" />}
                <span className="text-xs font-medium">
                  {msg.senderId === userId ? "You" : "User"}
                </span>
                <span className="text-xs opacity-75">{msg.timestamp}</span>
              </div>
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
