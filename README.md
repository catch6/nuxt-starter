# Nuxt Starter

一个基于 Nuxt 4 的前端起步模板，内置 Tailwind CSS v4、Pinia 持久化、VueUse、shadcn-nuxt、图标与图片优化能力，开箱即用的工程化配置（ESLint、TS 路径别名、预渲染首页等）。

## 功能与特性

- **Nuxt 4**：现代化同构应用框架，支持 SSR/SSG/CSR 与 Nitro 构建
- **Tailwind CSS v4**：通过 `@tailwindcss/vite` 插件集成，样式原子化，支持自定义主题与暗色模式变体
- **UI 组件**：集成 `shadcn-nuxt`，组件目录为 `components/ui`
- **状态管理**：`pinia` + `pinia-plugin-persistedstate`，带持久化（cookie 配置内置）
- **工具集**：`@vueuse/nuxt` 与 `vue-sonner`（全局 `toast` 预设导入）
- **图标与图片**：`@nuxt/icon`（lucide 图标集）、`@nuxt/image`（图片优化）
- **工程化**：Antfu ESLint 规则、TypeScript 路径别名、`postinstall` 自动 `nuxt prepare`
- **预渲染**：`routeRules` 预渲染首页 `/`

## 技术栈

- Framework：`nuxt@^4.2.1`、`vue@^3.5.24`
- Styling：`tailwindcss@^4`、`@tailwindcss/vite`
- State：`pinia@^3`、`pinia-plugin-persistedstate@^4`
- Utils：`@vueuse/nuxt@14`、`vue-sonner`
- UI：`shadcn-nuxt`、`lucide-vue-next`、`@nuxt/icon`、`@nuxt/image`
- Lint：`eslint@^9`、`@antfu/eslint-config`
- Lang：`typescript@^5.9`

## 环境要求

- Node.js：建议 20+（LTS）
- 包管理器：pnpm（项目声明为 `packageManager: pnpm@10.20.0`）

## 目录结构（关键文件）

- `app/`：源码根目录（见 `tsconfig.json` 中 `~`/`@` 映射到 `./app`）
- `app/assets/css/tailwind.css`：Tailwind 入口与主题变量定义
- `components/ui`：shadcn-nuxt 组件输出目录（见 `nuxt.config.ts`）
- `public/`：静态资源（如 `favicon.ico`、`robots.txt`）
- `nuxt.config.ts`：Nuxt 配置
- `eslint.config.js`：ESLint 配置（Antfu 规则）
- `tsconfig.json`：TypeScript 配置与路径别名
- `.env`：环境变量文件（本地可自定义）

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发调试（本地 0.0.0.0 暴露）
pnpm dev

# 构建生产包
pnpm build

# 预渲染/静态生成（如需 SSG）
pnpm generate

# 本地预览构建产物
pnpm preview

# 代码检查与修复
pnpm lint
```

## NPM 脚本说明

- `dev`：`nuxt dev --host 0.0.0.0`
- `build`：`nuxt build`
- `generate`：`nuxt generate`
- `preview`：`nuxt preview`
- `postinstall`：`nuxt prepare`
- `lint`：`eslint --fix`

## 环境变量

项目使用 Nuxt `runtimeConfig` 管理运行时配置（公开配置 `public` 对客户端可见）。

- `NUXT_PUBLIC_API_BASE`：API 基地址。
  - 默认值（在 `nuxt.config.ts` 中）：`http://192.168.1.181:10501/api`
  - 推荐在不同环境通过 `.env` 覆盖：

```env
# .env 示例
NUXT_PUBLIC_API_BASE=https://api.example.com
```

> 注意：`public` 下的配置会暴露到客户端，请勿放置敏感信息。

## 样式与 UI

- Tailwind v4 已通过 Vite 插件启用，入口样式位于 `app/assets/css/tailwind.css`
- 暗色模式：采用 `@custom-variant dark` 方式处理暗色变体
- 主题变量：使用 `:root` 与 `@theme inline` 定义一组色板与半径变量，可按需扩展
- shadcn-nuxt：
  - 配置：`shadcn.prefix: ''`，`shadcn.componentDir: '~/components/ui'`
  - 推荐使用工具命令（参见 shadcn-nuxt 文档）新增组件

## 状态管理

- `@pinia/nuxt` 自动注入
- 已启用 `pinia-plugin-persistedstate`，默认使用 cookie 持久化，`maxAge` 为 2592000 秒（30 天），可按需调整

## 图标与图片

- `@nuxt/icon`：
  - 模式 `svg`，默认尺寸 `1.5rem`
  - 预载集合：`lucide`
  - 本地 API 路由：`/_nuxt_icon`
- `@nuxt/image` 用于图片优化与自适应加载

## 约定与自动导入

- `imports.dirs`：自动导入 `~/lib` 下的模块
- 预设导入：`vue-sonner` 的 `toast` 已通过 `imports.presets` 全局可用
- TS 路径别名：
  - `~` 与 `@` 指向 `./app`，可直接从 `~/xxx` 或 `@/xxx` 引用

## 预渲染与路由规则

- `routeRules`：`'/'` 主页预渲染（prerender）
- 可根据需求在 `nuxt.config.ts` 中扩展更多规则

## 构建与部署

### 生产构建

```bash
pnpm install
pnpm build
# 可选：静态生成
pnpm generate
```

构建完成后可使用 `pnpm preview` 在本地验证；生产环境建议使用支持 Node 运行的服务（如自管服务器、PM2、Docker 自行编排或 Nuxt 支持的各类平台）。

### 环境变量注入

- 部署平台需注入 `NUXT_PUBLIC_API_BASE` 等必要变量
- 若使用 SSG，请确保生成阶段与运行阶段的变量一致性

## 代码规范与检查

- ESLint：基于 `@antfu/eslint-config`，在 `eslint.config.js` 中可查看启用规则与忽略目录
- 建议在 IDE 中启用 ESLint/TypeScript 插件以获得更好提示
