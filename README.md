# WeChat Messages Server — 管理端 UI

<!-- README-I18N:START -->

**[English](./README.en.md)** | **简体中文**（当前）

<!-- README-I18N:END -->

基于 **Vue 3 + Vben Admin** 的微信公众号 **管理后台**，对接 [WeChat Messages Server](https://github.com/fan-stars/wechat-messages-server) 后端 API。

本仓库为 **前端 monorepo**（`apps/web-antd`）；Spring Boot 服务在独立后端仓库维护。

## 仓库地址

|  | 后端 API | 管理端 UI（本仓库） |
| --- | --- | --- |
| **Gitee** | [fan-stars/wechat-messages-server](https://gitee.com/fan-stars/wechat-messages-server) | [fan-stars/wechat-messages-server-vben](https://gitee.com/fan-stars/wechat-messages-server-vben) |
| **GitHub** | [fan-stars/wechat-messages-server](https://github.com/fan-stars/wechat-messages-server) | [fan-stars/wechat-messages-server-vben](https://github.com/fan-stars/wechat-messages-server-vben) |

## 致谢

后端衍生自 **[ruoyi-vue-pro](https://gitee.com/zhijiantianya/ruoyi-vue-pro)**。本 UI 基于 Vben Admin / 芋道 admin 体系，与上述后端配套使用。

## 技术栈

- Vue 3、TypeScript、Vite
- Ant Design Vue（`apps/web-antd`）
- pnpm workspace（Turbo）

## 快速开始

### 环境要求

- Node.js 20+
- pnpm 9+
- 已启动的后端 API（默认 `http://127.0.0.1:48080`）

### 安装与开发

```bash
pnpm install
pnpm dev:antd
```

在 `apps/web-antd` 中配置 `VITE_GLOB_API_URL` 指向后端地址。

### 构建

```bash
pnpm build:antd
```

## MP / 消息转发（管理端）

本仓库提供转发相关页面的配置与运维界面；**业务逻辑与 HTTP 透传契约在后端**。

| 功能 | 前端路径（约） | 说明 |
| --- | --- | --- |
| 转发规则 | `apps/web-antd/src/views/mp/forward/rule/` | 同步/异步、优先级、超时、接收响应、响应作回复等 |
| 转发日志 | `apps/web-antd/src/views/mp/forward/log/` | 请求/响应体、HTTP 状态、耗时、超时排查 |

后端设计文档（编排时序、表结构、下游对接）见后端仓库：

**[fan-module-mp/docs/mp-message-forward-design.md](https://github.com/fan-stars/wechat-messages-server/blob/master/fan-module-mp/docs/mp-message-forward-design.md)**

（Gitee：[同路径](https://gitee.com/fan-stars/wechat-messages-server/tree/master/fan-module-mp/docs/mp-message-forward-design.md)）

## 其他公众号页面

账号、粉丝、消息、自动回复、素材等菜单由 ruoyi / Vben 体系原有 MP 模块页面提供，与后端 `fan-module-mp` 一致。

## License

遵循本仓库及上游 Vben / 芋道 admin 模板的相关开源协议。
