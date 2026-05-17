import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Camera, Film, Music, MapPin, ExternalLink, Play, Sparkles } from 'lucide-react';

const socialLinks = [
  {
    name: '小红书',
    icon: <Camera className="w-6 h-6" />,
    url: 'https://xiaohongshu.com/user/profile/', // Replace with actual URL
    color: 'from-red-500 to-rose-600',
    hoverColor: 'group-hover:shadow-red-500/50',
    desc: '随手记录，分享生活碎片与思考'
  },
  {
    name: 'Bilibili',
    icon: <Film className="w-6 h-6" />,
    url: 'https://space.bilibili.com/', // Replace with actual URL
    color: 'from-blue-400 to-cyan-500',
    hoverColor: 'group-hover:shadow-cyan-500/50',
    desc: '长视频分享，深度解析与日常vlog'
  },
  {
    name: '抖音',
    icon: <Music className="w-6 h-6" />,
    url: 'https://douyin.com/', // Replace with actual URL
    color: 'from-slate-800 to-black',
    hoverColor: 'group-hover:shadow-purple-500/50',
    desc: '捕捉瞬间的精彩，用镜头表达态度'
  }
];

const lifeImages = [
  {
    src: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&q=80&w=600',
    alt: 'Travel',
    tag: 'EXPLORE',
    span: 'col-span-12 md:col-span-8 row-span-2'
  },
  {
    src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
    alt: 'Photography',
    tag: 'MOMENTS',
    span: 'col-span-12 md:col-span-4 row-span-1'
  },
  {
    src: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=600',
    alt: 'Cityscape',
    tag: 'NIGHT WALK',
    span: 'col-span-12 md:col-span-4 row-span-1'
  }
];

export default function LifeStyle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef}
      className="py-32 relative bg-slate-50 overflow-hidden"
      id="life"
    >
      {/* Background decorations */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-50" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-100 rounded-full blur-[100px] opacity-50" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div 
          style={{ opacity, y }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-sm font-semibold tracking-wider text-slate-600 mb-6 uppercase">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Beyond The Code
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">
            Life & Explore
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            生活不只有代码与工作，还有在镜头下捕捉的每一个瞬间。
            <br />去感受世界，体验未知，保持热爱与好奇。
          </p>
        </motion.div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-12 auto-rows-[240px] gap-4 mb-20">
          {lifeImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative rounded-3xl overflow-hidden group ${img.span}`}
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 text-white font-bold tracking-widest text-xs uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <MapPin className="w-4 h-4" />
                {img.tag}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Links Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className={`group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/20 hover:-translate-y-2 transition-all duration-300 ${link.hoverColor}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${link.color} text-white flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                {link.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                {link.name}
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {link.desc}
              </p>
              
              {/* Optional interactive element inside card */}
              <div className="absolute top-8 right-8 w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 group-hover:scale-110 transition-all duration-300">
                <Play className="w-3 h-3 text-slate-400 group-hover:text-slate-900" />
              </div>
            </motion.a>
          ))}
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-slate-400 mt-16"
        >
          以上主页链接均为示例，点击将跳转至相应平台的个人主页。
        </motion.p>
      </div>
    </section>
  );
}
