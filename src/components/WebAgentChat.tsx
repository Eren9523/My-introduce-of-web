import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, ArrowLeft, RefreshCw, Sparkles, MessageSquare, Lock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function WebAgentChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [authKey, setAuthKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessageCount = messages.filter(m => m.role === 'user').length;
    if (userMessageCount >= 3 && !authKey) {
      setShowAuthModal(true);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setError(null);

    const newUserMessage: Message = {
      role: 'user',
      parts: [{ text: userMessage }]
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          authKey
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.needsAuth) {
          setShowAuthModal(true);
          // 撤回刚添加的 userMessage，因为后端拒绝了
          setMessages(prev => prev.slice(0, -1));
          throw new Error('需要授权码才能继续使用');
        }
        throw new Error(errorData.error || '发送失败');
      }

      const data = await response.json();
      const modelMessage: Message = {
        role: 'model',
        parts: [{ text: data.text }]
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const verifyAuthCode = async () => {
    if (!authInput.trim()) return;
    setIsVerifying(true);
    setAuthError(null);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifyKey: authInput.trim() }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '验证失败');
      }
      setAuthKey(authInput.trim());
      setShowAuthModal(false);
      setAuthInput('');
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">Web Agent</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 font-medium">在线 | AI 助手</span>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={resetChat}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>清除记录</span>
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-500 mb-2">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">你好！我是您的 Web Agent</h2>
              <p className="text-slate-500 max-w-sm">
                我可以协助您完成信息查询、文案创作、代码编写及多种自动化任务。
              </p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-md pt-4">
                {[
                  "帮我生成一段营销文案",
                  "解释一下 React Hook",
                  "制定一份健身计划",
                  "翻译几句地道的英文"
                ].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                    }}
                    className="p-3 text-sm text-left bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all text-slate-600 shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center shadow-sm ${
                  msg.role === 'user' ? 'bg-white text-slate-600' : 'bg-indigo-600 text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.parts[0].text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden relative"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  您的体验次数已结束，如需申请授权码请联系管理者
                </h3>
                
                <div className="mt-6 space-y-4">
                  <input
                    type="password"
                    value={authInput}
                    onChange={(e) => setAuthInput(e.target.value)}
                    placeholder="输入授权码..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                    onKeyDown={(e) => e.key === 'Enter' && verifyAuthCode()}
                  />
                  {authError && (
                    <p className="text-red-500 text-sm font-medium">{authError}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAuthModal(false)}
                      className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={verifyAuthCode}
                      disabled={isVerifying || !authInput.trim()}
                      className="flex-1 px-4 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "确认"
                      )}
                    </button>
                  </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400 font-medium tracking-wide">
                  保护API钱包人人有责~
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Input */}
      <footer className="p-6 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="问点什么..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none h-[52px] max-h-32"
              rows={1}
            />
            <div className="absolute right-3 top-3 text-slate-300">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-12 h-[52px] bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-wider">
          Powered by Gemini 2.0 Flash Agent
        </p>
      </footer>
    </div>
  );
}
