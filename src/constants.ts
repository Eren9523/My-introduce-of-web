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

export interface CampusExperience {
  organization: string;
  role: string;
  period: string;
  description: string[];
}

export interface Award {
  title: string;
  level: string;
  date: string;
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
    id: 'ecom-calc',
    title: 'E-Metric - 电商运营全能计算器',
    description: '电商专家级的指标分析工具。内置 GMV、CVR、ROI、CPC 等 30+ 核心公式，深度集成跨境电商物流成本与汇率波动模型，助力数据驱动决策。',
    tags: ['电商', '数据分析', '工具'],
    link: '/ecom-calc',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'sheet-flow',
    title: 'SheetFlow - 智能表格自动化',
    description: '办公自动化神器。基于 SheetJS 架构，实现浏览器端轻量化 Excel 处理。支持 VLOOKUP 批量匹配、自动化数据透视及 90% 常用办公公式的一键生成。',
    tags: ['数据处理', '办公自动化', '算法'],
    link: '/sheet-flow',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'web-agent',
    title: 'Web Agent - 在线 AI 智能代理',
    description: '极致轻量化、无需部署、随时随地在网页端开启的 AI 助手。主打超快响应速度与极简操作体验，为您提供即时、高效的智能化在线支持。',
    tags: ['AI/LLM', '在线助手', '生产力'],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'open-claw',
    title: '茶茶 Open Claw - 本地 AI 智能体 (文件深控版)',
    description: '基于 Open Claw 自主代理架构的本地化硬核助手。深度集成底层文件系统，具备极强的环境感知与任务规划能力，支持毫秒级本地文件读写、格式转换与目录自动化管理。',
    tags: ['AI/LLM', 'Open Claw', '本地自动化'],
    github: 'https://github.com/Eren9523/SLFP',
    imageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000'
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
      '相关课程：Web 前端开发、数据库原理、数据采集与清洗、统计学基础。'
    ],
    url: 'https://www.hue.edu.cn/'
  }
];

export const CAMPUS_EXPERIENCES: CampusExperience[] = [
  {
    organization: '中南财经政法大学 - 大学生创业项目“慧羽茶途”',
    role: '市场总监 / 核心成员',
    period: '2025.09 - 至今',
    description: [
      '主导项目市场调研与品牌定位，搭建完整的视觉识别系统（VI）。',
      '负责新媒体矩阵，通过小红书、抖音等平台进行品牌推广，累计曝光量超 5w+。',
      '参与商业计划书撰写与路演展示，协助项目获得多项创业竞赛奖项。'
    ]
  },
  {
    organization: '湖北第二师范学院 - 电子商务协会',
    role: '会长',
    period: '2022.09 - 2024.06',
    description: [
      '统筹协会日常运营，成功组织“模拟电商周”等大型校园活动，参与人数逾 500 人。',
      '与多家本地电商企业达成产学研合作，为会员争取到 10 余个实习见习机会。',
      '负责协会对外公关工作，获校级“十佳社团”荣誉。'
    ]
  }
];

export const AWARDS: Award[] = [
  {
    title: '“挑战杯”中国大学生课外学术科技作品竞赛',
    level: '全国三等奖',
    date: '2023.11'
  },
  {
    title: '“互联网+”大学生创新创业大赛',
    level: '省级三等奖',
    date: '2023.08'
  },
  {
    title: '研究生学业奖学金',
    level: '一等奖',
    date: '2025.10'
  },
  {
    title: '湖北第二师范学院',
    level: '优秀毕业生 / 三好学生',
    date: '2025.06'
  }
];

