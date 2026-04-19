$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 加载配置文件（优先 deploy-config.json，其次 deploy-config-win.json）
$CONFIG_FILE = Join-Path $ScriptDir "deploy-config.json"
if (-Not (Test-Path $CONFIG_FILE)) {
    $WinConfig = Join-Path $ScriptDir "deploy-config-win.json"
    if (Test-Path $WinConfig) {
        $CONFIG_FILE = $WinConfig
    }
}
if (-Not (Test-Path $CONFIG_FILE)) {
    Write-Host "Config file not found in $ScriptDir (deploy-config.json or deploy-config-win.json)"
    exit 1
}

# 仓库根目录（本脚本位于 repo/scripts/deploy-fan/）
$RepoRoot = (Resolve-Path (Join-Path $ScriptDir "..\..")).Path

# 使用 ConvertFrom-Json 解析 JSON 文件并提取变量
$config = Get-Content $CONFIG_FILE | ConvertFrom-Json
$LocalProjectDirRaw = $config.local_project_dir
if ([System.IO.Path]::IsPathRooted($LocalProjectDirRaw)) {
    $LOCAL_PROJECT_DIR = $LocalProjectDirRaw
} else {
    try {
        $LOCAL_PROJECT_DIR = (Resolve-Path (Join-Path $RepoRoot $LocalProjectDirRaw)).Path
    } catch {
        Write-Host "Invalid local_project_dir (relative to repo root ${RepoRoot}): $LocalProjectDirRaw"
        exit 1
    }
}
$REMOTE_USER = $config.remote_user
$REMOTE_HOST = $config.remote_host
$REMOTE_PORT = $config.remote_port
$REMOTE_DIR = $config.remote_dir
$APP_NAME = $config.app_name
$BUILD_COMMAND = if ($null -ne $config.build_command -and $config.build_command -ne "") { $config.build_command } else { "pnpm run build:antd" }
$BUILD_OUTPUT_SUBPATH = if ($null -ne $config.build_output_subpath -and $config.build_output_subpath -ne "") { $config.build_output_subpath } else { "apps/web-antd/dist" }

# 1. 本地打包 @vben/web-antd
Write-Host "Step 1: Building Ant Design admin ($BUILD_COMMAND)..."
Set-Location $LOCAL_PROJECT_DIR
if (-Not $?) {
    Write-Host "Failed to enter project directory: $LOCAL_PROJECT_DIR"
    exit 1
}

Invoke-Expression $BUILD_COMMAND

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please check: $BUILD_COMMAND"
    exit 1
}

# 2. 上传打包后的文件到远程服务器
Write-Host "Step 2: Uploading the built files to the remote server..."
$BUILD_DIR = Join-Path $LOCAL_PROJECT_DIR $BUILD_OUTPUT_SUBPATH

# 检查打包目录是否存在
if (-Not (Test-Path $BUILD_DIR)) {
    Write-Host "Build directory not found: $BUILD_DIR"
    exit 1
}

# 使用 scp 递归上传整个 dist 目录
scp -P "$REMOTE_PORT" -r "$BUILD_DIR\*" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Upload failed! Please check the connection or directory path."
    exit 1
}

# 3. （可选）执行远程脚本，例如重启web服务
# Write-Host "Step 3: Executing the remote script..."
# $REMOTE_SCRIPT = "$REMOTE_DIR/restart-web.sh"  # 远程脚本路径
# ssh "${REMOTE_USER}@${REMOTE_HOST}" "bash $REMOTE_SCRIPT"
#
# if ($LASTEXITCODE -ne 0) {
#     Write-Host "Remote script execution failed!"
#     exit 1
# }

Write-Host "Ant Design admin deployment completed successfully!"
