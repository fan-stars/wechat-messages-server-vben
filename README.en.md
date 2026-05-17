# WeChat Messages Server — Admin UI

<!-- README-I18N:START -->

[简体中文](./README.md) | **English** (current)

<!-- README-I18N:END -->

**Vue 3 + Vben Admin** management frontend for [WeChat Messages Server](https://github.com/fan-stars/wechat-messages-server): MP accounts, messages, **forward rules**, **forward logs**, and related system modules.

This repository is the **frontend monorepo**. The Spring Boot API is maintained separately (see below).

## Repositories

|  | Backend API | Admin UI (this repo) |
| --- | --- | --- |
| **Gitee** | [fan-stars/wechat-messages-server](https://gitee.com/fan-stars/wechat-messages-server) | [fan-stars/wechat-messages-server-vben](https://gitee.com/fan-stars/wechat-messages-server-vben) |
| **GitHub** | [fan-stars/wechat-messages-server](https://github.com/fan-stars/wechat-messages-server) | [fan-stars/wechat-messages-server-vben](https://github.com/fan-stars/wechat-messages-server-vben) |

## Acknowledgments

The backend is derived from [ruoyi-vue-pro](https://gitee.com/zhijiantianya/ruoyi-vue-pro). This UI is based on the Vben Admin / Yudao admin stack used alongside that ecosystem.

## Tech stack

- Vue 3, TypeScript, Vite
- Ant Design Vue (`apps/web-antd`)
- pnpm workspace (Turbo)

## Quick start

### Requirements

- Node.js 20+
- pnpm 9+

### Install & dev

```bash
pnpm install
pnpm dev:antd
```

Dev server and API proxy are configured under `apps/web-antd` (point `VITE_GLOB_API_URL` at your running backend, default `http://127.0.0.1:48080`).

### Build

```bash
pnpm build:antd
```

## MP / forward features (UI)

| Feature       | Path (approx.)                             |
| ------------- | ------------------------------------------ |
| Forward rules | `apps/web-antd/src/views/mp/forward/rule/` |
| Forward logs  | `apps/web-antd/src/views/mp/forward/log/`  |

Backend behavior and HTTP contract: see the backend repo → `fan-module-mp/docs/mp-message-forward-design.md`.

## License

Follow the license terms of the upstream Vben / Yudao admin templates and this repository.
