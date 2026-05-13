import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, Code, Play } from 'lucide-react';
import { PROJECTS } from '../constants';
import ChatBot from './ChatBot';

export default function Projects() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Code className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">精选项目</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-4">
                    {project.github && (
                      <a href={project.github} className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 text-white transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.id === 'open-claw' && (
                      <button 
                        onClick={() => setIsChatOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-500 transition-colors shadow-lg"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        立即体验
                      </button>
                    )}
                    {project.link && (
                      <a href={project.link} className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 text-white transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Placeholder for future projects */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-slate-400 group hover:border-indigo-200 hover:text-slate-500 transition-colors">
             <Code className="w-12 h-12 mb-4 opacity-20 group-hover:opacity-40 transition-opacity" />
             <p className="font-medium">更多项目正在开发中...</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90]"
            />
            <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
