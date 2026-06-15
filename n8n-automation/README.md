# n8n Automation Setup — ManPharma

## Requirements
- Docker Desktop (Windows/Mac) ya Docker Engine (Linux)
- Git

## Install Docker
- Windows/Mac: https://www.docker.com/products/docker-desktop/
- Ubuntu Linux: `sudo apt install docker.io docker-compose`

## Start karo (ek command)

```bash
cd n8n-automation
docker compose up -d
```

Browser mein kholo: **http://localhost:5678**

## Stop karo

```bash
docker compose down
```

## Data kahan save hoga?
- Sare workflows aur credentials Docker volume `n8n_data` mein save honge
- Local `workflows/` folder mein backup rakh sakte ho

## Useful Integrations Available in n8n
- Gmail / Email
- WhatsApp (360dialog, Twilio)
- Telegram Bot
- Google Sheets
- Notion
- Slack
- GitHub
- MySQL / PostgreSQL
- HTTP Requests / Webhooks
- OpenAI / Local AI (Ollama)
- Instagram, Facebook
- Shopify, WooCommerce
- PDF, Excel processing
- Cron jobs / Scheduled tasks

## ManPharma ke liye Useful Automation Ideas
- Naya course/product launch hone par auto email
- Form submissions ka Google Sheets mein record
- WhatsApp pe order notifications
- Social media pe auto post schedule
- Student enrollment confirmation emails
