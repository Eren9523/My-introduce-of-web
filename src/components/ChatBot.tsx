import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Terminal, X, Trash2, Loader2, Play } from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const execCommandDeclaration: FunctionDeclaration = {
  name: "executeCommand",
  description: "Execute a shell command on the server. Use this to search files, check status, or run development scripts.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description: "The shell command to execute, e.g., 'ls -la', 'date', or 'whoami'.",
      },
    },
    required: ["command"],
  },
};

export default function ChatBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const executeServerCommand = async (command: string) => {
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      return await res.json();
    } catch (err) {
      return { error: 'Failed to connect to server' };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model' as any,
        parts: [{ text: m.content }]
      }));

      // In a real implementation, we might want to use ai.chats.create
      // But for simplicity and tool integration, we use generateContent
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...chatHistory, { role: 'user', parts: [{ text: input }] }],
        config: {
          systemInstruction: "You are 'Open Claw', an autonomous AI coding assistant. You help users with coding tasks and can execute shell commands on their behalf to explore the environment. Be professional, concise, and helpful.",
          tools: [{ functionDeclarations: [execCommandDeclaration] }],
        }
      });

      let assistantResponse = response.text || "";
      const functionCalls = response.functionCalls;

      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === "executeCommand") {
            const cmd = (call.args as any).command;
            setMessages(prev => [...prev, { role: 'system', content: `Executing: ${cmd}` }]);
            
            const result = await executeServerCommand(cmd);
            const output = result.stdout || result.stderr || result.error || "No output";
            
            // Feed back to Gemini
            const finalResponse = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [
                    ...chatHistory, 
                    { role: 'user', parts: [{ text: input }] },
                    response.candidates?.[0]?.content as any, // The tool call part
                    {
                        role: 'user', // In @google/genai, tool results are often sent back as 'user' or handled via specific response objects, but simplest is to just send the text back in context if not using the full chat session API
                        parts: [{ text: `Command Output:\n${output}` }]
                    }
                ],
                config: {
                    systemInstruction: "Summarize the result of the command execution and continue with the task.",
                }
            });
            assistantResponse = finalResponse.text || "Command executed.";
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please check your API key and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none"
    >
      <div className="w-full max-w-4xl h-[80vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-500 rounded-lg">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white leading-none">Open Claw</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">自主 AI 编程代理</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={clearHistory} className="p-2 text-slate-400 hover:text-white transition-colors" title="清空记忆">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(circle_at_50%_0%,rgba(30,41,59,0.5),transparent)]"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
              <Terminal className="w-12 h-12 text-indigo-500" />
              <div>
                <p className="font-bold text-white text-lg">初始化代理</p>
                <p className="text-slate-400 text-sm">你可以让我列出文件、检查状态或辅助编写代码。</p>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : msg.role === 'system'
                ? 'bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono rounded-none border-l-4 border-l-indigo-500'
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                {msg.role === 'system' && <span className="opacity-50 mr-2">$</span>}
                <span className="whitespace-pre-wrap">{msg.content}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-700 flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Claw 正在思考...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-slate-800/50 border-t border-slate-800">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="给 Open Claw 下达指令..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-3 text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">
            沙盒环境 • 按下回车发送
          </p>
        </div>
      </div>
    </motion.div>
  );
}
