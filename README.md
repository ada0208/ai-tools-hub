# AI工具宝

> 发现最新AI工具，提升工作效率

## 项目简介

AI工具宝是一个静态网页项目，旨在为用户提供最新、最全的AI工具导航。页面美观，操作简单，适合初学者和非技术用户。

## 主要功能
- 按分类浏览AI工具
- 支持关键词搜索
- 热门推荐、最新收录展示
- 工具详情弹窗，支持一键访问和复制链接
- 数据全部存储于 `ai_tools_data.json`，易于维护和扩展

## 本地运行方法
1. **推荐使用本地服务器访问**（否则部分功能如数据加载、复制链接等会因浏览器安全策略失效）

   - **方法一：VSCode Live Server插件**
     - 安装插件，右键 `index.html` → "Open with Live Server"
   - **方法二：Python内置服务器**
     ```bash
     python3 -m http.server 8000
     # 然后在浏览器访问 http://localhost:8000
     ```
   - **方法三：Node.js http-server**
     ```bash
     npx http-server
     ```

2. 直接访问 `http://localhost:8000` 或对应端口，页面即可正常使用。

## 文件结构说明
```
├── index.html         # 主页面
├── style.css          # 页面样式
├── app.js             # 主要交互逻辑
├── ai_tools_data.json # 所有AI工具数据，支持自定义扩展
└── README.md          # 项目说明
```

## 常见问题
- **为什么页面没有工具数据？**
  - 请务必用本地服务器访问，不能直接用 file:// 打开。
- **点击"访问工具"或"复制链接"无效？**
  - 请刷新页面，确保浏览器未缓存旧的js。
  - 建议使用最新版 Chrome、Edge、Safari、Firefox。
- **如何添加/修改AI工具？**
  - 直接编辑 `ai_tools_data.json`，刷新页面即可生效。

## 致谢
- 设计灵感参考 Apple 官方风格
- 感谢所有开源AI工具的贡献者

---
如有建议或问题，欢迎反馈！ 