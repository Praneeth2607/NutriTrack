import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { sendMessage } from "../services/chatbot";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hi! I'm your **NutriTrack Assistant**. I can help you find specialized food recommendations based on your goals!\n\nTry asking me for:\n- **High protein** foods\n- **Low carb** options\n- **Iron rich** or **Calcium rich** foods\n- **Low calorie** snacks" }
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
    <div className="max-w-5xl mx-auto h-[85vh] flex flex-col bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/60 overflow-hidden animate-fade-in relative">
      
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 flex items-center justify-between shadow-lg relative z-10">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl animate-pulse">
                🥗
            </div>
            <div>
                <h2 className="text-xl font-black tracking-tight uppercase">Nutri Assistant</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-ping"></span>
                    <span className="text-[10px] font-bold text-green-100 uppercase tracking-widest">Active Now</span>
                </div>
            </div>
        </div>
        <button className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
        </button>
      </div>
      
      {/* Messages Feed */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50 scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`group relative max-w-[85%] md:max-w-[70%] p-5 rounded-3xl shadow-sm transition-all hover:shadow-md ${
                m.role === "user" 
                ? "bg-gradient-to-br from-green-600 to-teal-700 text-white rounded-br-none" 
                : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
            }`}>
              <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-inherit prose-li:my-1">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
              <span className={`text-[9px] mt-2 block opacity-40 font-bold uppercase tracking-tighter ${m.role === "user" ? "text-right" : "text-left"}`}>
                {m.role === "user" ? "You" : "NutriTrack Bot"}
              </span>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-gray-100 text-gray-400 rounded-3xl p-4 rounded-bl-none shadow-sm flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Modern Pill Input */}
      <div className="p-6 bg-white/40 backdrop-blur-md border-t border-white/40 relative z-10">
        <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto group">
            <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Message your assistant..." 
                className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-6 pr-16 py-5 shadow-inner focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-400 transition-all font-medium text-gray-700 placeholder:text-gray-400"
            />
            <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="absolute right-2 p-4 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:hover:scale-100"
            >
                <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
            </button>
        </form>
        <p className="text-center text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-[0.2em]">
            Powered by NutriTrack Data Engine
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes fade-in-up { 
            0% { opacity: 0; transform: translateY(15px); } 
            100% { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        
        /* Markdown Overrides */
        .prose strong { color: inherit; font-weight: 800; }
        .prose ul { list-style-type: decimal; }
        .prose li::marker { color: inherit; font-weight: bold; }
      `}} />
    </div>
  );
}
