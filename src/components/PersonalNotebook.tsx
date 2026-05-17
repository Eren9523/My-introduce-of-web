import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Brain, Lock, User, UserPlus, LogOut, Code, Send, Trash2, MessageSquare, X, CheckCircle2, Circle, Clock, StickyNote } from 'lucide-react';

const NotebookHeader = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Different spring configs for weight simulation
  const springLarge = { damping: 40, stiffness: 40 };   // heavy
  const springMedium = { damping: 25, stiffness: 100 }; // medium
  const springSmall = { damping: 15, stiffness: 200 };  // agile

  const smoothXLarge = useSpring(mouseX, springLarge);
  const smoothYLarge = useSpring(mouseY, springLarge);
  
  const smoothXMedium = useSpring(mouseX, springMedium);
  const smoothYMedium = useSpring(mouseY, springMedium);
  
  const smoothXSmall = useSpring(mouseX, springSmall);
  const smoothYSmall = useSpring(mouseY, springSmall);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // push away from center
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden mb-12 rounded-[2.5rem] bg-slate-950 border border-slate-800 shadow-[0_0_60px_rgba(139,92,246,0.1)] group cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Rainbow Cursor Follower */}
      <motion.div
        className="absolute w-40 h-40 rounded-full pointer-events-none blur-[60px] opacity-0 group-hover:opacity-80 transition-opacity duration-300 z-0"
        style={{
          x: useTransform(smoothXSmall, x => x - 80),
          y: useTransform(smoothYSmall, y => y - 80),
          background: 'radial-gradient(circle, #ec4899, #8b5cf6, #3b82f6, #10b981)',
          left: '50%',
          top: '50%'
        }}
      />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Layer 1 (Base Ring - Large & Heavy) */}
      <motion.div 
        className="absolute w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full bg-slate-900/50 border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1),inset_0_0_20px_rgba(139,92,246,0.1)] z-10 flex items-center justify-center backdrop-blur-sm"
        style={{ 
          x: useTransform(smoothXLarge, x => -25 * Math.tanh(x / 300)), 
          y: useTransform(smoothYLarge, y => -25 * Math.tanh(y / 300)) 
        }}
      >
        {/* Layer 2 (Middle Ring - Medium) */}
        <motion.div 
          className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full bg-slate-900 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15),inset_0_0_15px_rgba(6,182,212,0.2)] z-20 flex items-center justify-center"
          style={{ 
            x: useTransform(smoothXMedium, x => -30 * Math.tanh(x / 300)), 
            y: useTransform(smoothYMedium, y => -30 * Math.tanh(y / 300)) 
          }}
        >
          {/* Layer 3 (Inner Circle - Small & Agile) */}
          <motion.div
            className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full bg-slate-950 shadow-[0_0_50px_rgba(236,72,153,0.3),inset_0_0_20px_rgba(236,72,153,0.2)] z-30 flex flex-col items-center justify-center relative border border-pink-500/40"
            style={{ 
              x: useTransform(smoothXSmall, x => -25 * Math.tanh(x / 300)), 
              y: useTransform(smoothYSmall, y => -25 * Math.tanh(y / 300)) 
            }}
          >
             <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 z-10 tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">脑内空间</h2>
             <p className="text-[9px] md:text-[10px] text-cyan-400 font-bold tracking-wider mt-1 z-10 opacity-80">CYBER NOTEBOOK</p>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Decorative Pills - Rainbow Colored */}
      <motion.div 
        className="absolute w-12 h-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] z-20"
        style={{ 
          x: useTransform(smoothXMedium, x => -40 * Math.tanh(x / 400) + 120), 
          y: useTransform(smoothYMedium, y => -40 * Math.tanh(y / 400) - 80) 
        }}
      />
      <motion.div 
        className="absolute w-8 h-3 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] z-20"
        style={{ 
          x: useTransform(smoothXSmall, x => -50 * Math.tanh(x / 400) - 140), 
          y: useTransform(smoothYSmall, y => -50 * Math.tanh(y / 400) - 50) 
        }}
      />
      <motion.div 
        className="absolute w-16 h-5 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] z-10 opacity-80"
        style={{ 
          x: useTransform(smoothXLarge, x => -30 * Math.tanh(x / 400) + 160), 
          y: useTransform(smoothYLarge, y => -30 * Math.tanh(y / 400) + 120) 
        }}
      />
    </div>
  );
};

interface UserPayload {
  userId: string;
  username: string;
  role: string;
}

interface LogComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  username: string;
  authorRole: string;
}

interface Post {
  id: string;
  author_id: string;
  title: string | null;
  content: string;
  created_at: string;
  username: string;
  authorRole: string;
  comments?: LogComment[];
}

interface Todo {
  id: string;
  author_id: string;
  content: string;
  is_completed: number;
  created_at: string;
  username: string;
  authorRole: string;
}

export default function PersonalNotebook({ preview = false }: { preview?: boolean }) {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // New Post State
  const [newPostContent, setNewPostContent] = useState('');
  
  // Comment State
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState('');

  // Todo State
  const [newTodoContent, setNewTodoContent] = useState('');

  useEffect(() => {
    // Check local storage for token on mount
    const storedToken = localStorage.getItem('log_token');
    if (storedToken) {
      try {
        const payloadStr = atob(storedToken.split('.')[1]);
        const payload = JSON.parse(payloadStr);
        setUser(payload);
      } catch (e) {
        localStorage.removeItem('log_token');
      }
    }

    fetchPosts();
    fetchTodos();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error('Failed to fetch posts');
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data);
    } catch (e) {
      console.error('Failed to fetch todos');
    }
  };

  const getToken = () => localStorage.getItem('log_token');

  const requireAuth = (callback: () => void) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    callback();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      localStorage.setItem('log_token', data.token);
      setUser(data.user);
      setIsAuthModalOpen(false);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('log_token', data.token);
      setUser(data.user);
      setIsAuthModalOpen(false);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const res = await fetch('/api/auth/guest', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('log_token', data.token);
      setUser(data.user);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('log_token');
    setUser(null);
  };

  const handleSubmitPost = async () => {
    if (!newPostContent.trim()) return;
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ content: newPostContent })
      });
      const data = await res.json();
      if (res.ok) {
        setPosts([data, ...posts]);
        setNewPostContent('');
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
        setIsAuthModalOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleComments = async (postId: string) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
      return;
    }
    
    try {
      const res = await fetch(`/api/posts/${postId}`);
      const data = await res.json();
      
      setPosts(posts.map(p => p.id === postId ? { ...p, comments: data.comments } : p));
      setActiveCommentPost(postId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitComment = async (postId: string) => {
    if (!newCommentContent.trim()) return;
    
    try {
      const res = await fetch('/api/log_comments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ post_id: postId, content: newCommentContent })
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, comments: [...(p.comments || []), data] };
          }
          return p;
        }));
        setNewCommentContent('');
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
        setIsAuthModalOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const res = await fetch(`/api/log_comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, comments: p.comments?.filter(c => c.id !== commentId) };
          }
          return p;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitTodo = async () => {
    if (!newTodoContent.trim()) return;
    
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ content: newTodoContent })
      });
      const data = await res.json();
      if (res.ok) {
        setTodos([data, ...todos]);
        setNewTodoContent('');
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
        setIsAuthModalOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTodos(todos.map(t => t.id === id ? { ...t, is_completed: data.is_completed } : t));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        setTodos(todos.filter(t => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const canDelete = (authorId: string) => {
    return user && (user.role === 'admin' || user.userId === authorId);
  };

  const displayPosts = preview ? posts.slice(0, 3) : posts;
  const displayTodos = preview ? todos.slice(0, 5) : todos;

  return (
    <section id="notebook" className="min-h-screen py-24 bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500/30 selection:text-indigo-900 border-t border-slate-200">
      <div className="container mx-auto px-6 max-w-6xl relative z-0">
        
        <NotebookHeader />

        {/* Auth Bar */}
        <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm mb-8">
          <div className="font-bold text-slate-700 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            <span>个人空间</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user.username}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${user.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-200' : user.role === 'guest' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
                    {user.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-1.5 rounded-md transition-all border border-indigo-200"
              >
                <Lock className="w-4 h-4" />
                <span>授权登录</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content: Thoughts / Records */}
          <div className="lg:col-span-8 space-y-6">
            {/* Input Area */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group focus-within:border-indigo-300 focus-within:shadow-md transition-all">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <textarea 
                onClick={() => requireAuth(() => {})}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={user ? "记录此刻的想法... (支持 Markdown 格式)" : "登录后即可分享你的想法..."}
                className="w-full bg-transparent border-none outline-none resize-none min-h-[100px] text-slate-700 placeholder:text-slate-400 focus:ring-0 leading-relaxed"
              ></textarea>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                  <Code className="w-3.5 h-3.5" /> 支持 Markdown
                </div>
                <button
                  onClick={() => requireAuth(handleSubmitPost)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>发布想法</span>
                </button>
              </div>
            </div>

            {/* Log Stream */}
            <div className="space-y-6">
              {displayPosts.map(post => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative group"
                >
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold uppercase overflow-hidden shadow-sm">
                        {post.username.substring(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{post.username}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${post.authorRole === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-200' : post.authorRole === 'guest' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
                            {post.authorRole}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {new Date(post.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    {canDelete(post.author_id) && (
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-5 text-[15px]">
                    {post.content}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-4 text-sm mt-5 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>评论 {post.comments ? `(${post.comments.length})` : ''}</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {activeCommentPost === post.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pt-5 space-y-5 border-t border-slate-100 bg-slate-50/50 -mx-6 px-6 -mb-6 pb-6 rounded-b-2xl">
                          {post.comments?.map(comment => (
                            <div key={comment.id} className="flex gap-3 group/comment">
                              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs text-slate-600 font-bold shrink-0">
                                {comment.username.substring(0, 1)}
                              </div>
                              <div className="flex-1 bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm relative">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-700">{comment.username}</span>
                                    <span className="text-[11px] text-slate-400">{new Date(comment.created_at).toLocaleTimeString()}</span>
                                  </div>
                                  {canDelete(comment.author_id) && (
                                    <button 
                                      onClick={() => handleDeleteComment(post.id, comment.id)}
                                      className="text-slate-400 hover:text-rose-500 opacity-0 group-hover/comment:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                                <div className="text-sm text-slate-600 leading-relaxed">
                                  {comment.content}
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Comment Input */}
                          <div className="flex gap-3 pt-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs text-indigo-600 font-bold shrink-0">
                              {user ? user.username.substring(0, 1).toUpperCase() : '?'}
                            </div>
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={newCommentContent}
                                onChange={(e) => setNewCommentContent(e.target.value)}
                                onFocus={() => requireAuth(() => {})}
                                placeholder={user ? "添加评论..." : "登录后即可评论..."}
                                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') requireAuth(() => handleSubmitComment(post.id));
                                }}
                              />
                              <button
                                onClick={() => requireAuth(() => handleSubmitComment(post.id))}
                                className="bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                              >
                                发送
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              {displayPosts.length === 0 && (
                <div className="text-center py-24 text-slate-400 bg-white border border-slate-200 border-dashed rounded-2xl">
                  <div className="flex justify-center mb-4"><Brain className="w-12 h-12 text-slate-200" /></div>
                  <p>目前还没有任何记录，来发布你的第一条灵感吧。</p>
                </div>
              )}
            </div>

            {preview && posts.length > 0 && (
              <div className="mt-8 pt-4 flex justify-center">
                <a 
                  href="/notebook"
                  className="bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-600 font-medium text-sm px-8 py-3 rounded-xl transition-all hover:shadow-md inline-flex items-center gap-2 group"
                >
                  <MessageSquare className="w-4 h-4" />
                  进入个人空间
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">-&gt;</span>
                </a>
              </div>
            )}
          </div>

          {/* Sidebar: Sticky Notes / Todos */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="text-lg font-black text-amber-900 mb-4 flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-amber-500" /> 
                日常便签 / 计划
              </h3>

              {/* Add Todo UI */}
              <div className="mb-6 flex gap-2">
                <input
                  type="text"
                  value={newTodoContent}
                  onChange={(e) => setNewTodoContent(e.target.value)}
                  onFocus={() => requireAuth(() => {})}
                  placeholder={user ? "添加日常计划或便签..." : "登录后即可添加便签..."}
                  className="flex-1 bg-white border border-amber-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-amber-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') requireAuth(handleSubmitTodo);
                  }}
                />
                <button
                  onClick={() => requireAuth(handleSubmitTodo)}
                  className="bg-amber-400 hover:bg-amber-500 text-amber-900 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Todo List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 pb-2">
                {displayTodos.map(todo => (
                  <motion.div 
                    key={todo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`group flex gap-3 p-3 rounded-xl border ${todo.is_completed ? 'bg-amber-100/50 border-amber-200 text-amber-800/60' : 'bg-white border-amber-200/80 text-amber-900'} shadow-sm relative transition-all`}
                  >
                    <button 
                      onClick={() => requireAuth(() => handleToggleTodo(todo.id))}
                      className={`shrink-0 mt-0.5 ${todo.is_completed ? 'text-amber-500' : 'text-amber-300 hover:text-amber-400'}`}
                    >
                      {todo.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm break-words ${todo.is_completed ? 'line-through' : ''}`}>
                        {todo.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-amber-500/70">
                          <User className="w-3 h-3" />
                          {todo.username}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-amber-500/70">
                          <Clock className="w-3 h-3" />
                          {new Date(todo.created_at).toLocaleDateString()} {new Date(todo.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>

                    {canDelete(todo.author_id) && (
                      <button 
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="absolute -top-2 -right-2 bg-white text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-full shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-all"
                        title="删除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                ))}
                {displayTodos.length === 0 && (
                  <div className="text-center py-12 text-amber-600/50 text-sm">
                    暂无便签，写点什么吧~
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" /> 身份认证
                </div>
                <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-full p-1.5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8">
                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl mb-8">
                  <button 
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    登录
                  </button>
                  <button 
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'register' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    注册
                  </button>
                </div>

                {authError && (
                  <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
                    {authError}
                  </div>
                )}

                <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">用户名</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="请输入数字、字母或中文"
                        className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl py-2.5 pl-9 pr-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">密码</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                        className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl py-2.5 pl-9 pr-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all mt-2 flex justify-center items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    {authMode === 'login' ? <User className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    {authMode === 'login' ? '立即登录' : '创建账号'}
                  </button>
                </form>

                <div className="mt-8 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-slate-400 font-medium">其他方式</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button 
                    onClick={handleGuestLogin}
                    className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    以游客身份快捷访问 &rarr;
                  </button>
                  <p className="text-xs text-slate-400 mt-2">
                    系统将为您分配一个随机游客ID
                  </p>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
