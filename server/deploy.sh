#!/bin/bash
# 一键部署脚本 - 在 Ubuntu 服务器上运行
# 用法：bash deploy.sh

set -e

echo "🚀 开始部署 TTS 中转服务..."

# 1. 安装 Node.js（如果没有）
if ! command -v node &> /dev/null; then
  echo "📦 安装 Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo "✅ Node.js $(node -v)"

# 2. 创建目录
sudo mkdir -p /opt/italian-miniapp/server
sudo cp tts-server.js /opt/italian-miniapp/server/
echo "✅ 代码已复制到 /opt/italian-miniapp/server/"

# 3. 安装 systemd 服务
sudo cp tts-server.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable tts-server
sudo systemctl restart tts-server
echo "✅ systemd 服务已启动"

# 4. 开放防火墙端口（如果用 ufw）
if command -v ufw &> /dev/null; then
  sudo ufw allow 3000/tcp
  echo "✅ 防火墙已放行 3000 端口"
fi

# 5. 测试
sleep 2
STATUS=$(curl -s http://localhost:3000/health | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])" 2>/dev/null)
if [ "$STATUS" = "ok" ]; then
  echo ""
  echo "🎉 部署成功！"
  echo "   接口地址: http://$(curl -s ifconfig.me):3000/tts?text=Ciao&lang=it"
  echo "   健康检查: http://$(curl -s ifconfig.me):3000/health"
else
  echo "❌ 服务启动异常，查看日志: sudo journalctl -u tts-server -n 50"
fi
