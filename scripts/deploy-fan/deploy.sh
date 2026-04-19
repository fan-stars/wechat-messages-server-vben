#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 加载配置文件（优先 deploy-config.json，其次按平台默认）
CONFIG_FILE="$SCRIPT_DIR/deploy-config.json"
if [ ! -f "$CONFIG_FILE" ]; then
  case "$(uname -s)" in
    Darwin)
      if [ -f "$SCRIPT_DIR/deploy-config-mac.json" ]; then
        CONFIG_FILE="$SCRIPT_DIR/deploy-config-mac.json"
      fi
      ;;
  esac
fi
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Config file not found. Place deploy-config.json (or deploy-config-mac.json) in $SCRIPT_DIR"
  exit 1
fi

# 仓库根目录（本脚本位于 repo/scripts/deploy-fan/）
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# 使用 jq 解析 JSON；build_command / build_output_subpath 可覆盖默认值（Ant Design 应用）
LOCAL_PROJECT_DIR_RAW=$(jq -r '.local_project_dir' "$CONFIG_FILE")
if [[ "$LOCAL_PROJECT_DIR_RAW" == /* ]]; then
  LOCAL_PROJECT_DIR="$LOCAL_PROJECT_DIR_RAW"
else
  LOCAL_PROJECT_DIR="$(cd "$REPO_ROOT/$LOCAL_PROJECT_DIR_RAW" && pwd)" || {
    echo "Invalid local_project_dir (relative to repo root $REPO_ROOT): $LOCAL_PROJECT_DIR_RAW"
    exit 1
  }
fi
REMOTE_USER=$(jq -r '.remote_user' "$CONFIG_FILE")
REMOTE_HOST=$(jq -r '.remote_host' "$CONFIG_FILE")
REMOTE_PORT=$(jq -r '.remote_port' "$CONFIG_FILE")
REMOTE_DIR=$(jq -r '.remote_dir' "$CONFIG_FILE")
APP_NAME=$(jq -r '.app_name' "$CONFIG_FILE")
BUILD_COMMAND=$(jq -r '.build_command // "pnpm run build:antd"' "$CONFIG_FILE")
BUILD_OUTPUT_SUBPATH=$(jq -r '.build_output_subpath // "apps/web-antd/dist"' "$CONFIG_FILE")

# 1. 本地打包 @vben/web-antd（根目录 pnpm build:antd）
echo "Step 1: Building Ant Design admin ($BUILD_COMMAND)..."
cd "$LOCAL_PROJECT_DIR" || { echo "Failed to enter project directory!"; exit 1; }

$BUILD_COMMAND

if [ $? -ne 0 ]; then
  echo "Build failed! Please check the build command: $BUILD_COMMAND"
  exit 1
fi

# 2. 上传打包后的目录到远程服务器
echo "Step 2: Uploading the built files to the remote server..."
BUILD_DIR="$LOCAL_PROJECT_DIR/$BUILD_OUTPUT_SUBPATH"

# 检查打包目录是否存在
if [ ! -d "$BUILD_DIR" ]; then
  echo "Build directory not found: $BUILD_DIR"
  exit 1
fi

# 使用 scp 递归上传整个 dist 目录（添加 -r 参数）
scp -P "$REMOTE_PORT" -r "$BUILD_DIR"/* "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

if [ $? -ne 0 ]; then
  echo "Upload failed! Please check the connection or directory path."
  exit 1
fi

# 3. 执行远程脚本（可选，例如重启web服务）
#echo "Step 3: Executing the remote script..."
#REMOTE_SCRIPT="$REMOTE_DIR/restart-web.sh"  # 远程脚本路径
#ssh "$REMOTE_USER@$REMOTE_HOST" "bash $REMOTE_SCRIPT"
#
#if [ $? -ne 0 ]; then
#  echo "Remote script execution failed!"
#  exit 1
#fi

echo "Ant Design admin deployment completed successfully!"
