#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🔧 ManPharma n8n Setup"
echo "────────────────────────"

# Check Docker
if ! command -v docker &>/dev/null; then
  echo "❌ Docker not found. Install from: https://www.docker.com/products/docker-desktop/"
  exit 1
fi
echo "✅ Docker found: $(docker --version | cut -d' ' -f3 | tr -d ',')"

# Create .env from example if not exists
if [ ! -f "$ROOT_DIR/.env" ]; then
  cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
  KEY=$(openssl rand -hex 32 2>/dev/null || cat /proc/sys/kernel/random/uuid 2>/dev/null | tr -d '-')
  sed -i "s/change-this-to-a-random-secret-key/$KEY/" "$ROOT_DIR/.env"
  echo "✅ .env created with auto-generated encryption key"
else
  echo "✅ .env already exists"
fi

# Create data directory
mkdir -p "$ROOT_DIR/data"
echo "✅ Data directory ready"

echo ""
echo "✅ Setup complete! Run: ./scripts/start.sh"
