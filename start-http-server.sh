#!/bin/zsh
# 啟動 Python http.server，支援自訂 port，預設 8000

PORT=${1:-8000}

# 自動偵測 macOS，啟動 http.server
python3 -m http.server $PORT 