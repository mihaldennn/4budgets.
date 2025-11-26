import React, { useState, useRef, useEffect } from 'react';
import { BudgetCategory, Transaction } from '../types';
import { analyzeFinances, chatWithAdvisor } from '../services/geminiService';
import { Sparkles, Send, X, Bot, RefreshCw } from 'lucide-react';

interface AdvisorProps {
  budgets: BudgetCategory[];
  transactions: Transaction[];
  onClose: () => void;
}

const Advisor: React.FC<AdvisorProps> = ({ budgets, transactions, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "Hi! I'm your 4Budgets financial guide. How can I help you optimize your spending today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await chatWithAdvisor(userMsg, { budgets });
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: "Analyze my finances, please." }]);
    
    const analysis = await analyzeFinances(budgets, transactions);
    
    setMessages(prev => [...prev, { role: 'ai', text: analysis }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Sparkles size={20} className="text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Gemini Advisor</h3>
            <p className="text-xs text-indigo-100 opacity-80">Powered by Google AI</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-2">
              <Bot size={16} className="text-indigo-500 animate-bounce" />
              <span className="text-xs text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Actions */}
      <div className="p-2 bg-white border-t border-slate-100 flex gap-2 shrink-0 overflow-x-auto">
        <button 
          onClick={handleAnalyze}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-600 rounded-full text-xs font-medium hover:bg-violet-100 transition-colors whitespace-nowrap"
        >
          <RefreshCw size={12} />
          Analyze My Spending
        </button>
         <button 
          onClick={() => setInputValue("How can I save more?")}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium hover:bg-emerald-100 transition-colors whitespace-nowrap"
        >
          Savings Tips
        </button>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your budget..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Advisor;
