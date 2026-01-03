import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { chatWithAI } from '../api/apiAI';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your event assistant. Ask me anything about upcoming events or for recommendations!", sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = inputText;
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setInputText("");
        setIsLoading(true);

        try {
            const response = await chatWithAI(userMessage);
            setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: "Sorry, I encountered an error connecting to the AI service. Please make sure the AI module is running.", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 print:hidden">
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center text-white"
                >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75" style={{ animationDuration: '3s' }}></div>
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`
                bg-white rounded-2xl shadow-2xl w-80 md:w-96 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right
                animate-in slide-in-from-bottom-10 fade-in zoom-in-95
            `} style={{ height: '500px', maxHeight: '80vh' }}>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Sparkles size={20} />
                            <h3 className="font-semibold">Event AI Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`
                                max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                                ${msg.sender === 'user'
                                        ? 'bg-violet-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'}
                            `}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex gap-2 items-center">
                                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                                placeholder="Ask for recommendations..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isLoading}
                                className={`p-2 rounded-full text-white transition-colors ${!inputText.trim() || isLoading ? 'bg-gray-300' : 'bg-violet-600 hover:bg-violet-700'}`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIChatWidget;
