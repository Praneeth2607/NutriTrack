import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../services/chatbot";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hi! I'm your NutriTrack assistant. Try asking me for 'high protein', 'low carb', 'low calorie', 'iron rich', or 'calcium rich' foods!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessage(userMessage);
      setMessages(prev => [...prev, { role: "bot", content: response.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, I had trouble processing that request. Please try again later." }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-lg shadow-md border overflow-hidden">
      <div className="bg-green-600 text-white p-4 font-bold text-lg shadow">
        Nutri Assistant
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-lg p-3 whitespace-pre-wrap ${m.role === "user" ? "bg-green-600 text-white rounded-br-none" : "bg-white border text-gray-800 rounded-bl-none shadow-sm"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border text-gray-500 rounded-lg p-3 rounded-bl-none shadow-sm italic">
              Typing...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask me for food recommendations..." 
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2 font-bold transition-colors disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  );
}
