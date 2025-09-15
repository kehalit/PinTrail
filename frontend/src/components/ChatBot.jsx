import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chatFlow from "../api/chatFlow";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const resetChat = () => {
    const step = chatFlow["start"];
    setMessages([{ content: step.content, options: step.options || [] }]);
  };

  const sendChoice = (choice) => {
    if (choice === "Back") {
      resetChat();
      return;
    }

    let step = chatFlow[choice];
    if (step?.redirect) step = chatFlow[step.redirect];
    if (!step) return;

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { content: step.content, options: step.options || [] },
      ]);
    }, 800);
  };

  // Load initial message only once
  useEffect(() => {
    resetChat();
  }, []);

  const getButtonColor = (option) => {
    if (option.includes("Back")) return "bg-gray-300 hover:bg-gray-400";
    if (option.includes("trip") || option.includes("Trips"))
      return "bg-green-200 hover:bg-green-300";
    if (option.includes("sign up") || option.includes("Account"))
      return "bg-blue-200 hover:bg-blue-300";
    if (option.includes("Photo"))
      return "bg-yellow-200 hover:bg-yellow-300";
    return "bg-gray-100 hover:bg-gray-200";
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {/* Chat Bubble Toggle */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white p-4 text-2xl rounded-full shadow-lg flex items-center justify-center"
        >
          💬
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col mt-3"
          >
            {/* Header with Title + Close */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                PinTrail Assistant
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 p-3">
              {messages.map((m, i) => (
                <div key={i} className="text-left">
                  <p className="p-2 bg-gray-100 dark:bg-gray-700 rounded whitespace-pre-line">
                    {m.content}
                  </p>
                  {m.options &&
                    m.options.map((opt) => (
                      <button
                        key={opt}
                        className={`m-1 px-3 py-1.5 rounded text-sm transition ${getButtonColor(
                          opt
                        )}`}
                        onClick={() => sendChoice(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                </div>
              ))}

              {/* Typing Indicator */}
              {typing && (
                <div className="flex items-center space-x-2 p-2 bg-gray-200 dark:bg-gray-700 rounded w-fit">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    PinTrail
                  </span>
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
