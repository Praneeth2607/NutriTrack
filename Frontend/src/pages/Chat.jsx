import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { sendMessage } from "../services/chatbot";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Agent **Nutri Assistant** online.\n\nStatus: Synced with Dataset.\nCapability: Specialized Nutrition Architecture.\n\nWhat high-impact nutritional inquiry do you have today?" }
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
      setMessages(prev => [...prev, { role: "bot", content: "Error: Neural Link Interrupted. Retry." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="h-[85vh] flex flex-col max-w-6xl mx-auto px-4 animate-fade-in mb-20">
      
      {/* Background Asset */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <img src="/dashboard_hero_bg_1774790398014.png" className="w-full h-full object-cover blur-[100px]" alt="" />
      </div>

      <div className="relative z-10 h-full flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Agent Persona Module */}
        <div className="w-full md:w-80 h-fit bg-white/70 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 p-8 shadow-xl">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-green-200">🤖</div>
                <div>
                   <h3 className="text-xl font-black text-gray-800 tracking-tighter leading-none">NutriBot</h3>
                   <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">v4.0 Alpha</span>
                </div>
             </div>
             
             <div className="space-y-6">
                <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Primary Core</span>
                    <p className="text-xs font-bold text-gray-600">Indian Food Database Analyzer</p>
                </div>
                <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Current Context</span>
                    <p className="text-xs font-bold text-gray-600">Personalized Health Optimization</p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                   <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                        <span className="text-[10px] font-extrabold text-gray-800 uppercase tracking-widest">Neural Link Active</span>
                   </div>
                </div>
             </div>
        </div>

        {/* Right Side: Chat Container */}
        <div className="flex-1 flex flex-col bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/60 shadow-2xl overflow-hidden relative">
            
            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar relative z-10">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
                        <div className={`max-w-[90%] md:max-w-[80%] p-6 rounded-[2rem] shadow-sm relative transition-all hover:shadow-md ${
                            m.role === "user"
                            ? "bg-gray-900 text-white rounded-br-none"
                            : "bg-white border border-gray-100 text-gray-800 rounded-bl-none ring-8 ring-gray-50/50"
                        }`}>
                            <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-inherit prose-li:my-1">
                                <ReactMarkdown>{m.content}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 p-6 rounded-[2rem] rounded-bl-none flex gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Input Module */}
            <div className="p-8 bg-white/60 border-t border-gray-100 relative z-20">
                <form onSubmit={handleSend} className="relative group max-w-3xl mx-auto">
                    <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder="Inquire Neural Link..." 
                        className="w-full bg-white rounded-[2rem] border border-gray-100 p-6 pr-20 font-black text-gray-800 focus:outline-none focus:ring-8 focus:ring-green-500/5 focus:border-green-400 transition-all shadow-inner placeholder:text-gray-300 placeholder:font-normal"
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !input.trim()} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-900 hover:bg-black text-white p-4 rounded-3xl transition-all hover:scale-105 active:scale-95 disabled:opacity-20 shadow-xl"
                    >
                        <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}} />
    </div>
  );
}
