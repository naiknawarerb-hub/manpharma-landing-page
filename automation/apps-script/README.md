# ManPharma Sales Engine — Google Apps Script (recommended)

A **complete automated sales team** that runs **free on Google's servers** — no VPS, no Docker, no n8n hosting. Your Google Sheet is the CRM; Apps Script does the reaching out, following up, and closing.

> [!tip] Why Apps Script instead of n8n?
> The n8n version needed a server. Apps Script runs inside your Google account for free, talks to your Sheet natively, sends email with one line, and gives you webhook URLs via a Web App deployment. For a solo educator this is simpler and cheaper. (The n8n version is still in `../n8n-workflows/` if you ever want it.)

---

## 🧑‍💼 The "sales team" (what each part does)

| Role | Function | Runs when |
|------|----------|-----------|
| 🧲 **SDR / Lead Gen** | `captureLead_` | Website form / new contact → saves to CRM + welcome |
| 💬 **Responder** | `handleInbound_` | Incoming DM → keyword auto-reply (price/sample/syllabus/buy) |
| 🤝 **Closer** | `runDripNurture` | Daily 10:00 → sends next follow-up (Day1→Day6 offers) |
| 📣 **Outreach** | `runBroadcast` | Mon/Wed/Fri 18:00 → promo blast to whole audience |
| 💳 **Account Manager** | `handlePurchase_` | Sale event → mark Customer, thank-you + upsell + referral |
| 📊 **Sales Manager** | `sendDailyReport` | Daily 21:00 → pipeline report to you |

Files: `Config.gs` · `Sheet.gs` · `Channels.gs` · `SalesTeam.gs` · `WebApp.gs` · `Setup.gs` · `appsscript.json`

---

## 🚀 Setup (15 min, no server)

### 1. Create the CRM Sheet
- New Google Sheet → **name it "ManPharma CRM"**.
- Copy its **Sheet ID** from the URL: `docs.google.com/spreadsheets/d/`**`<ID>`**`/edit`.

### 2. Create the Apps Script project
- In the Sheet: **Extensions → Apps Script**.
- Delete the default `Code.gs`, then create files matching each `.gs` here and paste the contents (or use [`clasp`](https://github.com/google/clasp) to push the whole folder).

### 3. Add your settings
Open **Project Settings → Script properties** and add (recommended — keeps tokens out of code):

| Property | Value |
|----------|-------|
| `SHEET_ID` | your Sheet ID |
| `ADMIN_EMAIL` | naiknawarerb@gmail.com |
| `WEBHOOK_SECRET` | any long random string |
| `TELEGRAM_BOT_TOKEN` | from @BotFather |
| `TELEGRAM_CHANNEL_ID` | `@yourchannel` (broadcast) |
| `ADMIN_TELEGRAM_CHAT_ID` | your own chat id (alerts) |
| `WA_PHONE_NUMBER_ID`, `WA_TOKEN` | *(optional)* WhatsApp Cloud API |
| `IG_BUSINESS_ID`, `IG_TOKEN` | *(optional)* Instagram |

*(No Script properties? The fallbacks in `Config.gs` are used — fine for a quick test.)*

### 4. Build the sheet + triggers
- In the editor, run **`initSalesEngine`** once. Approve the OAuth permissions.
- This creates the **Leads / Content / Subscribers** tabs and installs the daily triggers.
- Import your broadcast posts: paste `../templates/content-calendar.csv` into the **Content** tab.

### 5. Deploy the Web App (gives you the URLs)
- **Deploy → New deployment → Web app**.
- Execute as **Me**, Access **Anyone**. Deploy → copy the **`/exec` URL**.
- Endpoints (POST JSON with your `secret`):
  - `…/exec?action=lead` — website form / new lead
  - `…/exec?action=purchase` — sale event
  - `…/exec?action=inbound` — incoming WhatsApp/IG message
  - `…/exec?action=telegram` — Telegram bot webhook

### 6. Connect Telegram (free — start here)
- Put your `/exec` URL into `registerTelegramWebhook` (`Setup.gs`) and run it once.
- Now DMs to your bot get auto-replies + become leads.

### 7. Connect the landing page
In `../../index.html` SITE_CONFIG set:
```js
leadWebhook : "https://script.google.com/macros/s/XXXX/exec?action=lead",
```
The form already POSTs `name/contact/channel`. Add your `secret` to the request if you enabled `WEBHOOK_SECRET` (or send it from a tiny proxy — see note below).

> The public form can't safely hold the secret. Options: (a) leave `WEBHOOK_SECRET` as the default and rely on the endpoint being unlisted, (b) validate leads by a simple honeypot, or (c) front it with a Cloudflare Worker that injects the secret. For a low-risk education funnel, (a) is usually fine.

---

## 🧪 Test it (Telegram path, free)

1. Run `initSalesEngine`, connect Telegram, message your bot `price` → you get the pricing reply and a row appears in **Leads**.
2. In that row set `next_action_at` = today, `stage` = 1 → run `runDripNurture` → you receive the next drip message.
3. Simulate a sale:
   ```bash
   curl -X POST "https://script.google.com/macros/s/XXXX/exec?action=purchase" \
     -H "Content-Type: application/json" \
     -d '{"secret":"YOUR_SECRET","name":"Test","contact":"<chat_id>","channel":"telegram","amount":"69"}'
   ```
   → Row flips to **Customer**, thank-you + upsell sent, you get a sale alert.
4. Run `sendDailyReport` → pipeline summary lands in your email/Telegram.

---

## 🔁 Daily use
- **New promo?** Add rows to **Content** (`status=pending`) — oldest pending goes out each Mon/Wed/Fri.
- **Edit copy?** Change the strings in `Config.gs` → `MESSAGES()`.
- **Pipeline?** The **Leads** tab is your CRM (`New → Nurturing → Hot → Customer → Lost`).

> [!caution] Compliance & limits
> - Only message opted-in people (WhatsApp/IG/email anti-spam rules).
> - Apps Script daily quotas: email ~100/day (consumer Gmail), UrlFetch ~20k/day — plenty for a starting funnel, but batch large broadcasts.
