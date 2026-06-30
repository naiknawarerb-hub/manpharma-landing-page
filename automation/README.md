# ManPharma — n8n Marketing & Sales Automation

A self-hosted [n8n](https://n8n.io) system that acts as ManPharma Tutorials' marketing + sales agent:

**Reach students → Tell them about the notes → Follow up until they buy.**

All messages are **fixed pre-written copy (Hinglish)** — no AI, no API keys. Leads live in a **Google Sheet** that doubles as your CRM. Channels: **Telegram, Email, WhatsApp, Instagram.**

---

## 1. The funnel (how the 5 workflows fit together)

```
                 ┌─────────────────────────┐
  Website form ──►                         │
  Telegram DM  ──► 01 Lead Capture ────────► Google Sheet "Leads" (status=New)
  WA / IG DM   ──►   (instant welcome)      │
                 └─────────────────────────┘
                              │ daily
                              ▼
                    02 Drip Nurture  ──► Day1 value → Day2 ₹69 offer → Day4 objections → Day6 last-chance
                              │
   purchase ──► 04 Conversion & Upsell ──► status=Customer (drip stops) + thank-you + combo upsell + referral + owner alert

  03 Broadcast Outreach (Mon/Wed/Fri) ──► posts from "Content" tab to Telegram channel + Email list + WhatsApp
  05 Inbound Auto-Reply ──► keyword replies (price / sample / syllabus / buy) on any channel
```

| # | Workflow | Trigger | Job |
|---|----------|---------|-----|
| 01 | Lead Capture | Webhook `/lead` + Telegram | Save lead to Sheet, send instant welcome + free sample |
| 02 | Drip Nurture | Schedule (daily 10:00) | Send the next follow-up message per lead, advance stage |
| 03 | Broadcast Outreach | Schedule (Mon/Wed/Fri 18:00) | Push promo posts to your whole audience |
| 04 | Conversion & Upsell | Webhook `/purchase` | Mark buyer, stop drip, thank-you + upsell + referral |
| 05 | Inbound Auto-Reply | Telegram + Webhook `/inbound` | Answer common questions automatically |

---

## 2. Prerequisites

- A server / VPS (or your PC) with **Docker**.
- A **Google account** (for the CRM sheet) + Google Cloud OAuth creds for n8n.
- A **Telegram bot** (free — start here, it works in 5 minutes).
- *(Optional)* SMTP/Gmail for email, WhatsApp Business Cloud API, Instagram Business + Meta app.

---

## 3. Install n8n (self-hosted, Docker)

```bash
docker volume create n8n_data

docker run -d --restart unless-stopped --name n8n \
  -p 5678:5678 \
  -e N8N_HOST="your-domain-or-ip" \
  -e WEBHOOK_URL="https://your-domain-or-ip/" \
  -e GENERIC_TIMEZONE="Asia/Kolkata" \
  -e TZ="Asia/Kolkata" \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

Open `http://your-ip:5678`, create the owner account.

> **Webhooks need a public HTTPS URL.** For a real server put n8n behind Nginx/Caddy with TLS and set `WEBHOOK_URL` to that domain. For quick local testing use a tunnel: `npx localtunnel --port 5678` or `cloudflared tunnel --url http://localhost:5678`, then set `WEBHOOK_URL` to the tunnel URL.

---

## 4. Create the Google Sheet (your CRM)

1. Create a Google Sheet named **ManPharma CRM** with three tabs:
   - **Leads** — import headers from [`sheets/crm-template.csv`](sheets/crm-template.csv).
   - **Content** — import [`templates/content-calendar.csv`](templates/content-calendar.csv) (broadcast posts).
   - **Subscribers** — one column `phone` (opted-in WhatsApp numbers for broadcast).
2. Copy the **Sheet ID** from its URL: `docs.google.com/spreadsheets/d/`**`<THIS_PART>`**`/edit`.
3. In n8n: **Credentials → New → Google Sheets (OAuth2)** and connect your Google account ([n8n Google OAuth guide](https://docs.n8n.io/integrations/builtin/credentials/google/)).

---

## 5. Import the workflows

For each file in [`n8n-workflows/`](n8n-workflows/): n8n → **Workflows → Import from File** → select the `.json`.

Then in **every** imported workflow, fix these placeholders:

| Placeholder | Replace with | Where |
|-------------|--------------|-------|
| `YOUR_SHEET_ID` | Your Google Sheet ID | every Google Sheets node |
| `YOUR_EMAIL` | Your from-address | Email nodes |
| `YOUR_WA_PHONE_NUMBER_ID` | WhatsApp Cloud phone number ID | WhatsApp nodes |
| `YOUR_IG_BUSINESS_ID` | Instagram Business account ID | Instagram HTTP nodes |
| `YOUR_TELEGRAM_CHANNEL_ID` | Your public channel `@handle` | wf 03 |
| `YOUR_ADMIN_TELEGRAM_CHAT_ID` | Your own chat id (for sale alerts) | wf 04 |
| `YOUR_SUBSCRIBER_LIST_OR_BCC` | Email list / BCC address | wf 03 |

Also pick the right **credential** on each Google Sheets / Telegram / Email / WhatsApp node (dropdown at the top of the node).

---

## 6. Channel setup

### Telegram (free — recommended to start)
1. Talk to [@BotFather](https://t.me/BotFather) → `/newbot` → copy the **bot token**.
2. n8n → **Credentials → Telegram** → paste token. Use it on every Telegram node.
3. For the broadcast channel (wf 03): create a Telegram channel, add your bot as **admin**, set `YOUR_TELEGRAM_CHANNEL_ID` to `@yourchannel`.
4. To get `YOUR_ADMIN_TELEGRAM_CHAT_ID`: message your bot, then open `https://api.telegram.org/bot<token>/getUpdates` and read `chat.id`.

### Email (Gmail or SMTP)
- n8n → **Credentials → SMTP**. For Gmail use an [App Password](https://support.google.com/accounts/answer/185833). Select it on every Email node.

### WhatsApp (needs WhatsApp Business Cloud API)
1. Create a Meta app → add **WhatsApp** product → get a **phone number ID** + **permanent access token** ([Meta guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)).
2. n8n → **Credentials → WhatsApp** → paste token; set `YOUR_WA_PHONE_NUMBER_ID` on the nodes.
3. **Important:** WhatsApp only lets you message a user freely within **24h** of their last message. For cold outreach/drip you must use **pre-approved message templates**. Submit the drip texts in `templates/messages.md` as templates in Meta Business Manager.
   - *Simpler alternative:* swap the WhatsApp nodes for the **Twilio** node if you already use Twilio's WhatsApp sandbox/number.

### Instagram (most restrictive — read this)
- Instagram DM automation requires: an **IG Business/Creator account** linked to a Facebook Page, a **Meta app**, and the `instagram_manage_messages` permission (needs Meta **app review**).
- You can only reply **within 24h** of the user messaging you — no cold DMs.
- The workflows call the Graph API directly via HTTP nodes; set `YOUR_IG_BUSINESS_ID` and a **Header Auth** credential (`Authorization: Bearer <token>`).
- **Realistic recommendation:** run Telegram + Email + WhatsApp first; treat Instagram auto-reply as a phase-2 add-on once Meta approves your app.

---

## 7. Connect the landing page

The site's `index.html` has a lead-capture form. In the **SITE CONFIG** block near the top, set:

```js
leadWebhook : "https://your-n8n-domain/webhook/lead",
```

Now every form submit creates a lead in your Sheet and fires the instant welcome. (Until you set a real URL the form just sends people to the free sample — nothing breaks.)

For **Graphy purchase tracking** (wf 04): if Graphy supports webhooks, point a purchase webhook at `https://your-n8n-domain/webhook/purchase` with `name`, `contact`, `channel`, `amount`. No webhook on your plan? Mark sales by POSTing that JSON manually, or build a tiny "mark paid" form.

---

## 8. Go live

1. Test each workflow with **Execute Workflow** (manual run) first.
2. When happy, toggle each workflow **Active** (top-right). Scheduled (02, 03) and trigger-based (01, 04, 05) workflows now run on their own.

---

## 9. End-to-end test (Telegram path — free, no Meta needed)

1. **Activate** wf 01 and wf 05. Message your bot `hi`.
   → A row appears in **Leads** (`status=New`) and you get the welcome + a keyword reply.
2. In the sheet set that row's `next_action_at` to today and `stage` to `1`.
3. **Execute** wf 02 manually → you receive the Day-2 drip message; the row's `stage`/`next_action_at` advance.
4. POST a fake purchase:
   ```bash
   curl -X POST https://your-n8n-domain/webhook/purchase \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","contact":"<your_chat_id>","channel":"telegram","amount":"69"}'
   ```
   → Row flips to `Customer`, drip stops, you get the thank-you + upsell, and the owner alert fires.

---

## 10. Day-to-day use

- **New campaign?** Add rows to the **Content** tab (`status=pending`) — wf 03 sends the oldest pending one each run.
- **Edit any message?** Update copy in [`templates/messages.md`](templates/messages.md), then paste into the matching node.
- **See your pipeline?** The **Leads** tab *is* your CRM — filter by `status` (New / Nurturing / Hot / Customer / Lost).

> ⚠️ **Compliance:** Only message people who opted in. Respect WhatsApp/Instagram/email anti-spam rules — bulk messaging to non-consenting users can get your numbers/accounts banned.
