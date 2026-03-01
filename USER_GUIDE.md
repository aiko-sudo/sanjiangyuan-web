# 三江源生态保护网站 - 管理与使用手册

## 🌟 项目概览
本项目是一个致力于三江源生态保护的公益平台，集成了实时数据大屏、UGC社区、非遗展示和用户个人中心。项目采用前后端分离架构，前端使用 Vue 3 + Vite，后端使用 Node.js + MongoDB。

## 🎨 视觉升级说明
我们对网站进行了全面的视觉升级，采用了**"深邃山河"**配色方案：
- **主色调**：深邃生态绿 (#1a5c48) —— 象征茂密的森林与植被。
- **辅助色**：冰川天空蓝 (#3e7b91) —— 象征纯净的水源与天空。
- **强调色**：高原日光金 (#bfa15f) —— 象征神圣的阳光与藏族文化。
- **设计风格**：采用现代化"玻璃拟态" (Glassmorphism)，使界面更具通透感和高级感，确保文字在复杂背景下的清晰度。

## 🚀 部署与管理 (Vercel)

### 1. 部署流程 (Vercel 全栈部署)
本项目已完全适配 Vercel，前端与后端 API (Serverless) 可同时部署。

1. **准备工作**:
   - 确保 MongoDB 数据库已在云端（如 MongoDB Atlas）准备好，并获取连接字符串 (`mongodb+srv://...`)。
   - 代码 Push 到 GitHub。

2. **Vercel 部署**:
   - 在 Vercel 控制台导入 GitHub 仓库。
   - **Framework Preset**: 选择 `Vite`。
   - **Build & Development Settings**:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - **Environment Variables** (环境变量):
     - `MONGODB_URI`: 你的云端数据库连接字符串 (必填)

3. **完成**:
   - 部署完成后，访问 `https://你的域名/` 即可查看网站。
   - API 接口位于 `https://你的域名/api/...`，前端会自动调用。

> **架构说明**: 
> 原 `server/` 目录下的 Express 应用已被改造为适配 Vercel 的 Serverless Function，入口文件为 `api/index.js`。你无需单独部署后端服务器。

### 2. ⚡ 性能优化指南 (关键)
为了获得最佳访问速度，请务必注意：
1. **数据库区域选择**: 
   - Vercel Serverless Function 默认部署在美国 (Washington, D.C. - iad1) 或自动匹配。
   - **强烈建议**: 将 MongoDB Atlas 的部署区域 (Region) 设置为与 Vercel 相同的区域 (例如都选 `AWS us-east-1`)，或者选择离目标用户最近的区域（如新加坡/香港），并在 Vercel 设置中手动指定 Region。
   - **原因**: Serverless 函数连接数据库的延迟是影响速度的最大因素。跨洲连接会导致显著卡顿。

2. **CDN 缓存**:
   - 我们已在 `vercel.json` 中配置了静态资源的长缓存策略。
   - 图片等资源会自动通过 Vercel 全球边缘网络 (Edge Network) 加速分发。

### 3. 域名管理 (Domains)
1. 在 Vercel 项目设置中找到 **Domains**。
2. 添加域名 `sanjiangyuan.help`。
3. 按照提示在你的域名注册商处配置 DNS 解析（通常是 CNAME 记录指向 `cname.vercel-dns.com`）。

## 🛡️ 后台管理入口 (Management)
网站配备了独立的后台管理系统，用于管理用户、帖子和数据。

### 1. 部署管理后台
由于管理后台是一个独立的 Vue 项目 (位于 `admin/` 目录)，建议将其作为**单独的项目**部署到 Vercel：
1. 在 Vercel Dashboard 点击 **"Add New..."** -> **"Project"**.
2. 导入同一个 GitHub 仓库 (`sanjiangyuan`).
3. **关键步骤**: 在 "Framework Preset" 下方，找到 **"Root Directory"** (根目录) 设置。
   - 点击 Edit，将其修改为 `admin`。
4. 部署后，你将获得一个新的管理后台地址 (例如 `sanjiangyuan-admin.vercel.app`)。
5. 建议为其绑定二级域名: `admin.sanjiangyuan.help`。

### 2. 本地运行后台
如果你需要在本地管理数据：
```bash
cd admin
npm install
npm run dev
```
- 本地默认地址: `http://localhost:5174` (通常是 5174，因为 5173 被前台占用)
- 默认管理员账号: `admin` / `admin123` (具体请查看数据库初始化设置或 `server/models`)

## 🛠 开发与维护指南

### 目录结构
```bash
sanjiangyuan/
├── src/                # 前端源代码 (Vue 3)
│   ├── views/          # 页面组件 (Index, Community, etc.)
│   ├── style.css       # 全局样式与配色变量
│   └── App.vue         # 根组件
├── admin/              # 管理后台 (独立项目)
└── server/             # 后端 API (Node.js/Express)
```

### 如何修改配色
所有颜色变量定义在 `src/style.css` 的 `:root` 中。要调整颜色，只需修改对应的 HEX 值：
```css
:root {
  --primary-color: #1a5c48; /* 主色 */
  --accent-color: #bfa15f;  /* 金色强调 */
}
```

### 本地启动
1. **安装依赖**:
   ```bash
   npm install
   ```
2. **启动前端**:
   ```bash
   npm run dev
   ```
3. **启动后端** (需先安装 MongoDB):
   ```bash
   cd server
   npm install
   npm start
   ```

## 📝 内容管理 (Admin)
后台管理系统位于 `admin/` 目录。
- 访问地址：(部署后通常是 `admin.sanjiangyuan.help` 或子路径)
- 功能：
  - **用户管理**: 查看注册用户、封禁违规账号。
  - **帖子审核**: 审核社区发布的 UGC 内容。
  - **数据统计**: 查看生态保护数据的录入与修改。

如有任何技术问题，请查阅 `README.md` 或联系技术支持。
