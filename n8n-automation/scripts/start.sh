#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

if [ ! -f "$ROOT_DIR/.env" ]; then
  echo "❌ .env not found. Run: ./scripts/setup.sh first"
  exit 1
fi

cd "$ROOT_DIR"
echo "🚀 Starting ManPharma n8n..."
docker compose up -d

echo ""
echo "⏳ Waiting for n8n to be ready..."
until curl -sf http://localhost:5678/healthz &>/dev/null; do
  sleep 2
done

echo "✅ n8n is running!"
echo "🌐 Open: http://localhost:5678"
