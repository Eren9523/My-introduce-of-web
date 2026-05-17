import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { MapPin, ExternalLink, Play, Sparkles } from 'lucide-react';

const socialLinks = [
  {
    name: '小红书',
    icon: (
      <svg viewBox="0 0 1024 1024" className="w-8 h-8" fill="currentColor">
        <path d="M720.9 661.1c-15.6 15.6-35.3 27.6-57.8 35-18.4 6-38.3 9.2-59.2 9.2-24.1 0-46.7-4-67.6-11.4-19.3-6.8-37.3-17.1-52.9-30-15.3-12.6-28.1-28.1-37.9-45.5-9.4-16.7-16-35.2-19.2-54.8-1.7-10.4-3.1-23.3-3.1-40.4V365H324v158.2c0 23.3 2.5 44 7.2 60.9 4.9 17.6 12 33.6 20.8 47.9 9 14.6 19.9 27.5 32 38.6 12.3 11.3 26 21 40.7 28.7 15.2 8 31.6 14.3 49 18.7 17.8 4.5 36.6 6.8 56.1 6.8 19.5 0 38.3-2.3 56.1-6.8 17.5-4.4 33.8-10.7 49-18.7 14.7-7.7 28.3-17.4 40.7-28.7 12.1-11.1 23-24 32-38.6 8.8-14.3 15.9-30.3 20.8-47.9 4.7-16.9 7.2-37.6 7.2-60.9v-73.4l154.2 119.5 31.5-49.4L640 404v119.3c0 17-1.4 30-3.1 40.4-3.2 19.5-9.8 38.1-19.2 54.8-9.8 17.5-22.6 33-37.9 45.5-15.6 12.9-33.6 23.2-52.9 30-20.9 7.4-43.5 11.4-67.6 11.4-20.9 0-40.8-3.2-59.2-9.2-22.5-7.4-42.2-19.4-57.8-35z"/>
        <path d="M422.3 271H324v94h98.3v-94zM731.4 271H633.2v64.6l-209.2-162V109l272.5 210.8V271h34.9v94h-34.9v-94z"/>
      </svg>
    ),
    url: 'https://www.xiaohongshu.com/',
    color: 'from-[#ff2442] to-[#ff2442]',
    hoverColor: 'group-hover:shadow-[#ff2442]/30',
    desc: '随手记录，分享生活碎片与思考',
    idText: '我的小红书：2939341558',
    platformId: '2939341558',
    hasTooltip: true
  },
  {
    name: 'Bilibili',
    icon: (
      <svg viewBox="0 0 1024 1024" className="w-7 h-7" fill="currentColor">
        <path d="M685.24 117.653c20.375-10.74 44.97-2.923 55.706 17.452 10.74 20.375 2.923 44.97-17.452 55.706L662.333 223.44h40.548c79.034 0 143.102 64.068 143.102 143.101v333.606c0 79.034-64.068 143.101-143.102 143.101H321.119c-79.034 0-143.101-64.067-143.101-143.101V366.541c0-79.033 64.067-143.101 143.101-143.101h41.458L301.417 190.81c-20.375-10.735-28.192-35.33-17.452-55.706 10.74-20.375 35.33-28.192 55.706-17.452l87.525 46.121h170.505l87.538-46.121zM702.88 295.441H321.118c-39.266 0-71.101 31.835-71.101 71.1v333.606c0 39.267 31.835 71.102 71.101 71.102h381.763c39.266 0 71.102-31.835 71.102-71.102V366.54c0-39.265-31.836-71.1-71.102-71.1zm-247.93 118.068c2.902 0 5.437.498 7.616 1.488 4.358 1.978 7.6 5.61 9.4 10.457L481.54 449l13.1 35.19-21.751 28.59-15.688 20.613-22.38-29.418-13.176-35.39c-.198-.535-.436-1.127-.723-1.802-.916-2.164-3.1-3.666-5.836-4.22-.093-.018-.189-.034-.286-.046l-.508-.046c-.524-.035-1.092-.054-1.683-.054h-100.83c-13.435.034-26.068 5.753-35.01 15.35-7.794 8.36-11.758 18.665-11.758 29.57 0 10.906 3.964 21.21 11.758 29.57v.001c8.951 9.606 21.59 15.289 35.035 15.289H357.65c8.71 0 13.916 4.7 15.545 13.882l2.455 13.42 16.326 62.66h51.487l-15.54-59.563-3.628-13.952h142.181l-3.642 13.952-15.546 59.563h51.487l16.326-62.645c1.077-4.464 1.834-8.736 2.278-12.87.502-4.667-.34-9.988-3.328-15.409l-13.916-25.04c6.307-2.617 11.536-7.07 14.8-13.235 4.14-7.854 5.25-17.433 3.127-28.77l-12.446-66.303-34.814-29.13h-44.5l-44.155 35.845-6.575-17.65vh63.29z"/>
      </svg>
    ),
    url: 'https://space.bilibili.com/412339816',
    color: 'from-[#00A1D6] to-[#00A1D6]',
    hoverColor: 'group-hover:shadow-cyan-500/50',
    desc: '长视频分享，深度解析与日常vlog',
    idText: '点击后直接跳转到我的主页，探索更多硬核内容',
    hasTooltip: false
  },
  {
    name: '抖音',
    icon: (
      <svg viewBox="0 0 1024 1024" className="w-8 h-8" fill="currentColor">
        <path d="M922.7 419.6c-4.4-4-9-4-13.9-3.9-63.5.5-126.9-19-178.5-56-42.5-30.5-74-73.6-89.9-123.6-7.8-24.6-11.4-50.5-11.2-76.8h-180v568.1c0 52-24 101.4-64 133.3-43 34.3-100 45-152.1 27.6-58.8-19.6-99-73.6-99-136.9 0-79.6 64.9-144.1 144.9-143.6 15.6.1 31 2.8 45.4 7.5v-176c-13.7-2.8-28-4.4-42.5-4.5C282 235.3 124 374.3 124 559.3 124 744.1 282 893.1 482.1 893.1c185.1 0 327.9-149 327.9-333.8V350.6c59.8 45.2 135 71.4 214 71.4v183.1c-37.1 0-72.9-9.1-104.9-20l3.6-185.5z"/>
      </svg>
    ),
    url: 'https://www.douyin.com/',
    color: 'from-slate-800 to-black',
    hoverColor: 'group-hover:shadow-purple-500/50',
    desc: '捕捉瞬间的精彩，用镜头表达态度',
    idText: '我的抖音：123081390',
    platformId: '123081390',
    hasTooltip: true
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

function SocialCard({ link, i }: { link: any, i: number }) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered && link.hasTooltip) {
      timer = setTimeout(() => {
        setIsHovered(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [isHovered, link.hasTooltip]);

  const handleClick = (e: React.MouseEvent) => {
    if (link.platformId) {
      navigator.clipboard.writeText(link.platformId).catch(() => {});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 + 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`block h-full group p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/20 hover:-translate-y-2 transition-all duration-300 ${link.hoverColor}`}
      >
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${link.color} text-white justify-center flex items-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
          {link.icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          {link.name}
          <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4">
          {link.desc}
        </p>
        
        {link.idText && (
          <p className="text-indigo-600/80 font-medium text-xs rounded-xl bg-indigo-50 px-3 py-2 border border-indigo-100">
            {link.idText}
          </p>
        )}
        
        <div className="absolute top-8 right-8 w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 group-hover:scale-110 transition-all duration-300">
          <Play className="w-3 h-3 text-slate-400 group-hover:text-slate-900" />
        </div>
      </a>

      <AnimatePresence>
        {isHovered && link.hasTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-max"
          >
            <div className="bg-slate-800/95 backdrop-blur-md text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-white/10 text-center leading-relaxed">
              由于平台设置无法直接跳转个人主页
              <br />个人ID已粘贴至剪切板
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800/95 rotate-45 border-b border-r border-white/10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
            <SocialCard key={link.name} link={link} i={i} />
          ))}
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-slate-400 mt-16"
        >
          部分平台受限制需通过ID检索，点击卡片即可复制平台ID。
        </motion.p>
      </div>
    </section>
  );
}
