# 星途伙伴微信小程序 MVP

这是一个面向六年级孩子的 Star 成长伙伴 / AI 成长学习助手 MVP。它包含：

- 原生微信小程序前端：孩子首页、成长对话、学习计划、家长页、设置页。
- Node 后端适配层：安全网关、孩子画像、学习计划、家长摘要、Hermes 调用封装。
- Hermes mock：默认不用真实密钥，也能跑通一次学习式回答流程。

## 项目结构

```text
miniprogram/          微信小程序前端
server/               后端适配层
server/src/safety.js  输入/输出安全策略网关
server/src/hermesClient.js
server/scripts/smoke-test.js
.env.example          服务端环境变量示例
```

## Obsidian 文档库

本项目已关联本机 Obsidian vault：

```text
C:\Users\86186\Documents\Fang\知识库\star
```

入口笔记是 `盒饭 Star 成长伙伴 Index.md`，项目文档放在：

```text
Projects\盒饭 Star 成长伙伴
```

代码、接口和可运行资源继续保存在本项目；产品决策、设计记录、Agent 安全边界、题库规划和迭代日志放在 Obsidian。关联说明见 `docs/obsidian-star.md`。

## 本地运行后端

```bash
copy .env.example .env
cd server
npm start
```

默认端口是 `http://127.0.0.1:3001`。默认 `HERMES_MOCK=true`，不会调用真实 Hermes。

浏览器打开 `http://127.0.0.1:3001/` 会看到一个移动端 Web 预览版前端，可直接体验首页、对话、计划、家长页和设置页。真正的小程序页面仍然需要在微信开发者工具里导入 `miniprogram/` 目录打开。

## 验证聊天流程

另开一个终端：

```bash
cd server
npm run smoke
```

验证脚本会跑通：

```text
孩子提问 -> 后端安全检查 -> Hermes mock -> 输出安全检查 -> 返回学习式回答
```

## 接入真实 Hermes

对话窗口可以接本地 Hermes 或 Hermes Agent。前端不用改，仍然只调用后端 `/api/chat`；后端根据 `.env` 去调用 Hermes。

### 优先调用本地 Hermes

如果本机已经安装 `hermes` 命令，可以使用本地 CLI 模式：

```env
HERMES_MOCK=false
HERMES_API_MODE=local-cli
HERMES_LOCAL_CLI_COMMAND=hermes
HERMES_LOCAL_CLI_TOOLSETS=clarify
HERMES_LOCAL_CLI_TIMEOUT_MS=60000
```

本项目默认 `.env` 已配置为本地 CLI 模式。儿童端只启用 `clarify` 工具集，不默认开放 terminal、file、browser 等高权限工具。

### 项目端安全版 Soul

儿童端不会读取你本机 Hermes 的全局 `SOUL.md`。后端会显式读取项目内安全版：

```text
server/prompts/star-growth-soul.md
```

对应环境变量：

```env
HERMES_PROJECT_SOUL_PATH=server/prompts/star-growth-soul.md
```

你可以在这个文件里调整“盒饭”的名字、语气、学习辅导规则和安全边界。后端仍使用 `--ignore-rules` 调用本地 Hermes，避免全局 Hermes 人格、记忆或项目外规则污染儿童端。

把 `.env` 改成 Agent 模式：

```env
HERMES_MOCK=false
HERMES_API_MODE=agent
HERMES_API_URL=https://your-hermes-api.example.com/v1/agent
HERMES_API_KEY=your_real_key
HERMES_AGENT_ID=your_agent_id
HERMES_MODEL=your_model_name
HERMES_ALLOWED_TOOLS=
```

注意：

- `HERMES_API_KEY` 只能放在服务端 `.env`，不能写入 `miniprogram/`。
- `HERMES_API_MODE=agent` 会向 Hermes 发送 `agent_id`、孩子问题、孩子画像、安全检查结果和工具白名单。
- `HERMES_ALLOWED_TOOLS` 默认留空，不开放终端、文件系统、任意网页浏览等高权限工具。
- 当前 Hermes 请求体是通用适配格式；如果你的 Hermes Server 协议不同，只需要调整 `server/src/hermesClient.js`。

## 运行小程序前端

1. 打开微信开发者工具。
2. 导入 `miniprogram/` 目录。
3. 确保后端在本机运行：`http://127.0.0.1:3001`。
4. 开发环境可开启“不校验合法域名”，或把后端域名配置到小程序 request 合法域名。

设置页里可以修改开发用后端地址。这个地址不是密钥。

## MVP 安全边界

- 前端只调用 `/api/*` 后端接口，不直接调用 Hermes。
- 前端不包含 Hermes key、模型 key 或内容审核 key。
- 后端输入和输出都经过 `safety-check`。
- MVP 阶段安全检查包含规则审核和 mock 模型审核标记；真实上线前应替换为正式内容审核模型。
- 严重风险表达会触发安抚式回复和家长提醒，不继续调用 Hermes。
- 家长页只展示学习主题、薄弱点、使用时长和风险提醒，不展示完整聊天记录。

## 当前限制

- 孩子画像、计划和摘要使用内存存储，重启后会恢复默认数据。
- 家长授权和角色边界用请求头与设置项模拟，还不是正式身份认证。
- 安全网关是规则 + mock 模型审核的 MVP，真实上线前应接入专业内容审核模型和人工兜底流程。
- 小程序 UI 是基础可运行版本，还没有接入真实微信登录、云数据库和发布配置。
