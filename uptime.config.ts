// UptimeFlare 配置文件
// 监控目标：大号 + 小号的所有服务

// Don't edit this line
import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  title: "zjkl's Status Page",
  links: [
    { link: 'https://github.com/827802685', label: 'GitHub', highlight: true },
  ],
}

const workerConfig: WorkerConfig = {
  monitors: [
    // ===== 大号 Workers =====
    {
      id: 'address_generator',
      name: '地址生成器',
      method: 'GET',
      target: 'https://rag.zjkl0330.dpdns.org',
      statusPageLink: 'https://rag.zjkl0330.dpdns.org',
      timeout: 15000,
    },
    {
      id: 'clist_cf',
      name: '云盘',
      method: 'GET',
      target: 'https://clist.zjkl0330.dpdns.org',
      statusPageLink: 'https://clist.zjkl0330.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'freellmapi_cf',
      name: '免费模型',
      method: 'GET',
      target: 'https://api.zjkl0330.dpdns.org',
      statusPageLink: 'https://api.zjkl0330.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'modelradar',
      name: 'RSS免费模型',
      method: 'GET',
      target: 'https://rss.zjkl.dpdns.org',
      statusPageLink: 'https://rss.zjkl.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'nextchat',
      name: 'Chat',
      method: 'GET',
      target: 'https://chat.zjkl.dpdns.org',
      statusPageLink: 'https://chat.zjkl.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'password_2',
      name: 'UUID生成器',
      method: 'GET',
      target: 'https://uuid.zjkl0426.dpdns.org',
      statusPageLink: 'https://uuid.zjkl0426.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'ra2web',
      name: '红警',
      method: 'GET',
      target: 'https://ra2web.827802685.workers.dev',
      statusPageLink: 'https://ra2web.827802685.workers.dev',
      timeout: 10000,
    },
    {
      id: 'tancise',
      name: 'Tancise',
      method: 'GET',
      target: 'https://tcs.zjkl0330.dpdns.org',
      statusPageLink: 'https://tcs.zjkl0330.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'tiktok_saver',
      name: 'TikTok Saver',
      method: 'GET',
      target: 'https://video.zjkl.dpdns.org',
      statusPageLink: 'https://video.zjkl.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'web_clipboard_big',
      name: '剪贴板',
      method: 'GET',
      target: 'https://jtb.zjkl0716.dpdns.org',
      statusPageLink: 'https://jtb.zjkl0716.dpdns.org',
      timeout: 10000,
    },

    // ===== 大号 Pages =====
    {
      id: 'moon_tv',
      name: '电视',
      method: 'GET',
      target: 'https://moon.zjkl.dpdns.org',
      statusPageLink: 'https://moon.zjkl.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'tv_ty',
      name: 'TV',
      method: 'GET',
      target: 'https://tv.zjkl0426.dpdns.org',
      statusPageLink: 'https://tv.zjkl0426.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'telegraph_image',
      name: '图盘',
      method: 'GET',
      target: 'https://img.zjkl0330.dpdns.org',
      statusPageLink: 'https://img.zjkl0330.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'newsnow',
      name: '新闻聚合',
      method: 'GET',
      target: 'https://news.zjkl0330.dpdns.org',
      statusPageLink: 'https://news.zjkl0330.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'sink',
      name: '短链',
      method: 'GET',
      target: 'https://zjkl0330.dpdns.org',
      statusPageLink: 'https://zjkl0330.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'herta_kuru',
      name: '黑塔转圈圈',
      method: 'GET',
      target: 'https://htzq.zjkl0330.dpdns.org',
      statusPageLink: 'https://htzq.zjkl0330.dpdns.org',
      timeout: 10000,
    },
    {
      id: 'magic_sudoku',
      name: '数独',
      method: 'GET',
      target: 'https://magic-sudoku.pages.dev',
      statusPageLink: 'https://magic-sudoku.pages.dev',
      timeout: 10000,
    },

    // ===== 小号 Workers =====
    {
      id: 'rin_server',
      name: '博客',
      method: 'GET',
      target: 'https://rin-server.zjkl0501.workers.dev',
      statusPageLink: 'https://rin-server.zjkl0501.workers.dev',
      timeout: 10000,
    },
    {
      id: 'mail',
      name: '邮件',
      method: 'GET',
      target: 'https://mail.zjkl0501.workers.dev',
      statusPageLink: 'https://mail.zjkl0501.workers.dev',
      timeout: 10000,
    },

    // ===== 小号 Pages =====
    {
      id: 'splayer',
      name: 'SPlayer',
      method: 'GET',
      target: 'https://splayer-5r2.pages.dev',
      statusPageLink: 'https://splayer-5r2.pages.dev',
      timeout: 10000,
    },
  ],
}

const maintenances: MaintenanceConfig[] = []

// Don't edit this line
export { maintenances, pageConfig, workerConfig }
