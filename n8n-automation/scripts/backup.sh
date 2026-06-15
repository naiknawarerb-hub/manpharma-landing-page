#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$ROOT_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

echo "💾 Backing up n8n data..."
docker run --rm \
  --volumes-from manpharma-n8n \
  -v "$BACKUP_DIR":/backup \
  alpine tar czf /backup/n8n-backup-$TIMESTAMP.tar.gz /home/node/.n8n

echo "✅ Backup saved: $BACKUP_DIR/n8n-backup-$TIMESTAMP.tar.gz"
