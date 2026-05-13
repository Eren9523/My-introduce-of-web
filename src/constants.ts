import { Code, ExternalLink, Mail, MessageSquare, Phone, User, Briefcase, GraduationCap, Github } from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  imageUrl?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  period: string;
  gpa: string;
  details: string[];
  url?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'open-claw',
    title: '茶茶 - AI Agent 助手',
    description: '基于 Open Claw 自主代理架构开发的智能助手。具备环境感知、任务规划与自主执行能力，是探索 AI 原生应用开发的重要实践。',
    tags: ['AI/LLM', 'Autonomous Agent', 'Open Claw'],
    github: 'https://github.com/Eren9523/SLFP',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'game-social',
    title: '第九空间 - 个人娱乐平台',
    description: '一个深度集成的个人娱乐中枢，连接多平台游戏数据，汇聚实时游戏资讯，并搭载专属语音服务器。这是我的第九艺术梦工厂。',
    tags: ['娱乐', '社区', '个人项目'],
    link: '/game-platform',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000'
  }
];

export const EXPERIENCES: Experience[] = [
  {
    company: '壹药网科技（上海）股份有限公司',
    role: '平台运营实习生 (平台运营部)',
    period: '2025.12 - 2026.03',
    description: [
      '负责商家全生命周期运营，完成采销对接、资质审核与开户全流程，搭建标准化入驻体系。',
      '1v1 对接商家需求，联动优化商品结构与权益配置，带动对接商家活跃度提升 28%。',
      '独立负责平台 MP 账号全流程运营，为商城活动累计引流超 15w 人次。',
      '搭建业务核心数据看板，跟踪动销率、转化率、活动 GMV 等核心指标并输出分析报告。'
    ]
  },
  {
    company: '新东方教育科技集团',
    role: '产品运营实习生 (大学事业部)',
    period: '2025.07 - 2025.12',
    description: [
      '联动课程产品与市场跨部门团队，设计并落地 10 余场校园宣讲会及学习打卡营活动。',
      '独立完成宣传素材拍摄、视频剪辑与文案优化，累计产出推广短片 18 条，整体触达超 2.5 万人次。',
      '负责用户数据整理沉淀，参与活动复盘，提炼优化点反哺运营策略迭代。'
    ]
  },
  {
    company: '亿家购科技有限公司',
    role: '跨境电商运营实习生 (运营部)',
    period: '2025.07 - 2025.09',
    description: [
      '独立负责 Facebook 平台广告全流程运营，包括内容策划剪辑、受众分层与投放设置。',
      '搭建投放数据监测体系，利用 ROI、转化率等指标快速识别数据异常并管控投放成本。',
      '通过对不同素材和受众的转化差异总结规律，优化后投放 ROI 均值达 1:3.2，较初始提升 45%。'
    ]
  }
];

export const EDUCATION: Education[] = [
  {
    school: '中南财经政法大学',
    degree: '硕士',
    major: '农村发展',
    period: '2025.09 - 至今',
    gpa: '3.87/4.0',
    details: [
      '主导大学生创业项目“慧羽茶途”市场板块。',
      '相关课程：货币金融学、西方经济学、人工智能与应用（数据分析基础）。'
    ],
    url: 'https://www.zuel.edu.cn/'
  },
  {
    school: '湖北第二师范学院',
    degree: '学士',
    major: '电子商务',
    period: '2021.09 - 2025.07',
    gpa: '3.1/4.0',
    details: [
      '荣获“挑战杯”全国三等奖、“互联网+”省级三等奖。',
      '相关课程：Web 前端开发、数据库原理、数据采集与清洗、统计学基础。'
    ],
    url: 'https://www.hue.edu.cn/'
  }
];
