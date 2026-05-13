import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Github, ExternalLink, Code } from 'lucide-react';
import { PROJECTS } from '../constants';

export default function Projects() {
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
          {PROJECTS.map((project, index) => {
            const isInternal = project.link?.startsWith('/');
            const targetUrl = project.link || project.github;
            
            const CardWrapper = ({ children }: { children: React.ReactNode }) => {
              if (isInternal && project.link) {
                return (
                  <Link to={project.link} className="block group">
                    {children}
                  </Link>
                );
              }
              return (
                <a 
                  href={targetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block group"
                >
                  {children}
                </a>
              );
            };

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CardWrapper>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <div className="flex items-center gap-2 text-white font-bold text-sm">
                          <span>查看详情</span>
                          <ExternalLink className="w-4 h-4" />
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
                  </div>
                </CardWrapper>
              </motion.div>
            );
          })}
          
          {/* Placeholder for future projects */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-slate-400 group hover:border-indigo-200 hover:text-slate-500 transition-colors">
             <Code className="w-12 h-12 mb-4 opacity-20 group-hover:opacity-40 transition-opacity" />
             <p className="font-medium">更多项目正在开发中...</p>
          </div>
        </div>
      </div>
    </section>
  );
}
