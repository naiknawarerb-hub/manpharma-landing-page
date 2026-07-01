---
title: Manpharma Marketing Automation
created: 2026-06-30
type: project-note
status: ready-to-deploy
tags:
  - manpharma
  - n8n
  - marketing-automation
  - sales-funnel
  - obsidian
aliases:
  - ManPharma Automation
  - n8n Marketing System
---

# 🎯 ManPharma Marketing & Sales Automation

> [!abstract] Ek line me
> Self-hosted **n8n** system jo ManPharma Tutorials ka marketing + sales agent banta hai:
> **Students tak pahunchna → product ke baare me batana → lead ko sale me convert karna.**
> Saare messages **pehle se likhe (fixed, no AI)** hain, leads **Google Sheet (CRM)** me, channels: **Telegram, Email, WhatsApp, Instagram.**

---

## 📌 Quick Facts

| Field | Detail |
|---|---|
| Product | D.Pharm (MSBTE ER20) study notes |
| Sell platform | Graphy checkout (UPI/Card/NetBanking) |
| Price | ₹69 early-bird (first 30) / ₹99 regular + combos |
| Automation tool | n8n (self-hosted, Docker) |
| Messages | Fixed Hinglish copy — **no AI / no API key** |
| Lead storage | Google Sheet (= CRM) |
| Channels | Telegram, Email, WhatsApp, Instagram |
| Repo branch | `claude/n8n-marketing-automation-c1k4w7` |
| Files location | `automation/` folder in repo |

---

## 🔁 Funnel (kaise sab jud-ta hai)

```
   Website form ─┐
   Telegram DM  ─┼─► [01 Lead Capture] ─► Google Sheet "Leads" (status=New) + instant welcome
   WA / IG DM   ─┘
                        │ (roz)
                        ▼
                  [02 Drip Nurture] ─► Day1 value → Day2 ₹69 offer → Day4 objections → Day6 last-chance
                        │
   purchase ─► [04 Conversion & Upsell] ─► status=Customer (drip band) + thank-you + combo upsell + referral + owner alert

   [03 Broadcast Outreach]  (Mon/Wed/Fri) ─► Telegram channel + Email list + WhatsApp
   [05 Inbound Auto-Reply]  ─► keyword replies (price / sample / syllabus / buy) kisi bhi channel pe
```

---

## ⚙️ 5 Workflows (n8n)

> [!info] Files: `automation/n8n-workflows/`

### 01 — Lead Capture
- **Trigger:** Webhook `/lead` (website form) + Telegram Trigger
- **Kaam:** lead normalize → Sheet me dedupe-check → naya lead append (`status=New, stage=0`) → channel ke hisaab se **instant welcome + free sample** bhejna
- File: `01-lead-capture.json`

### 02 — Drip Nurture
- **Trigger:** Schedule (roz 10:00 IST)
- **Kaam:** Sheet padho → jo leads "due" hain (New/Nurturing + `next_action_at <= aaj`) → stage ke hisaab se agla fixed message → channel route → row update (stage++, next date). Stage khatam → `Lost` mark.
- File: `02-drip-nurture.json`

### 03 — Broadcast Outreach *(reach & tell engine)*
- **Trigger:** Schedule (Mon/Wed/Fri 18:00)
- **Kaam:** "Content" tab se agla `pending` post → Telegram channel + Email blast + WhatsApp broadcast → post ko `sent` mark
- File: `03-broadcast-outreach.json`

### 04 — Conversion & Upsell
- **Trigger:** Webhook `/purchase` (Graphy webhook ya manual mark-paid)
- **Kaam:** lead dhundo → `status=Customer`, drip band → thank-you + **combo upsell** + **referral** → tumhe (owner) **sale alert**
- File: `04-conversion-upsell.json`

### 05 — Inbound Auto-Reply
- **Trigger:** Telegram Trigger + Webhook `/inbound` (WA/IG)
- **Kaam:** keyword router (`price`, `syllabus`, `sample`, `buy`, else→menu) → fixed jawab + Graphy link
- File: `05-inbound-autoreply.json`

---

## 🗂️ Google Sheet — "ManPharma CRM"

> [!note] 3 tabs banane hain
> - **Leads** — headers `automation/sheets/crm-template.csv` se import karo
> - **Content** — `automation/templates/content-calendar.csv` (15 ready promo posts)
> - **Subscribers** — ek column `phone` (opted-in WhatsApp numbers)

**Leads tab columns:**
`lead_id | name | channel | contact | subject_interest | source | status | stage | date_added | last_message_at | next_action_at | notes`

**Status flow:** `New → Nurturing → Hot → Customer → Lost`
**Stage:** `0` welcome → `1` value → `2` ₹69 offer → `3` objections → `4` last-chance → `5` done/customer

---

## 💬 Messages (fixed, Hinglish)

> [!tip] Source of truth
> Saari copy `automation/templates/messages.md` me hai. Wahan edit karo, phir matching n8n node me paste karo.

| Stage / Trigger | Message ka gist |
|---|---|
| Welcome (Day 0) | Welcome + free sample link |
| Day 1 | Important chapters + sample |
| Day 2 | Social proof + ₹69 early-bird urgency + checkout |
| Day 4 | Objection-busting + checkout |
| Day 6 | Last-chance + combo |
| Inbound | price / syllabus / sample / buy ke fixed replies |
| Conversion | thank-you + combo upsell + referral |
| Owner alert | "🟢 NEW SALE!" details |

---

## 🚀 Setup Checklist

> [!todo] Deploy steps
> - [ ] Docker se n8n chalao (command `automation/README.md` me)
> - [ ] Public HTTPS / tunnel set karo (webhooks ke liye zaroori)
> - [ ] Google Sheet "ManPharma CRM" banao (3 tabs)
> - [ ] n8n me Google Sheets OAuth credential connect karo
> - [ ] 5 workflows import karo
> - [ ] Placeholders bharo (`YOUR_SHEET_ID`, `YOUR_EMAIL`, etc.)
> - [ ] Telegram bot banao (@BotFather) + credential
> - [ ] Email (SMTP/Gmail App Password) credential
> - [ ] *(optional)* WhatsApp Business Cloud API setup
> - [ ] *(optional)* Instagram — Meta app review
> - [ ] Landing page me `leadWebhook` URL set karo (`index.html` → SITE_CONFIG)
> - [ ] Har workflow manually test karo → phir **Active** karo

### Placeholders to replace
| Placeholder | Kya daalna hai |
|---|---|
| `YOUR_SHEET_ID` | Google Sheet ID |
| `YOUR_EMAIL` | from-address |
| `YOUR_WA_PHONE_NUMBER_ID` | WhatsApp Cloud phone number ID |
| `YOUR_IG_BUSINESS_ID` | Instagram Business account ID |
| `YOUR_TELEGRAM_CHANNEL_ID` | broadcast channel `@handle` |
| `YOUR_ADMIN_TELEGRAM_CHAT_ID` | tumhara chat id (sale alerts) |
| `YOUR_SUBSCRIBER_LIST_OR_BCC` | email list / BCC |

---

## 📡 Channel Notes

> [!success] Telegram + Email
> Free, native n8n nodes, 5 min me chal jayenge. **Yahin se start karo.**

> [!warning] WhatsApp
> WhatsApp Business Cloud API chahiye. Cold/drip messages ke liye **pre-approved templates** lagenge (24h window rule). Twilio fallback bhi possible.

> [!danger] Instagram
> Sabse restrictive — Meta app + IG Business + `instagram_manage_messages` (app review). Sirf 24h window me reply. **Phase-2 me karo.**

---

## 🌐 Landing Page Hook

- `index.html` me "Free Sample chahiye?" **form** add hua hai
- SITE_CONFIG me set karo:
  ```js
  leadWebhook : "https://your-n8n-domain/webhook/lead",
  ```
- Blank chhodo to form bas free sample khol dega (kuch tootega nahi)
- **Graphy purchase tracking:** purchase webhook `→ /webhook/purchase` pe `name, contact, channel, amount` bhejo

---

## 🧪 End-to-End Test (Telegram — free)

1. wf 01 + wf 05 **Active** karo, bot ko `hi` bhejo → Sheet me row aayega + welcome + keyword reply
2. Us row me `next_action_at = aaj`, `stage = 1` set karo
3. wf 02 **Execute** karo → drip message aayega, stage advance
4. Fake purchase:
   ```bash
   curl -X POST https://your-n8n-domain/webhook/purchase \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","contact":"<chat_id>","channel":"telegram","amount":"69"}'
   ```
   → row `Customer` ban jayega, drip band, thank-you + owner alert

---

## 🗓️ Day-to-Day Use

- **Naya campaign?** "Content" tab me rows add karo (`status=pending`) → wf 03 oldest pending bhejta hai
- **Message edit?** `messages.md` update karo → node me paste
- **Pipeline dekhna?** "Leads" tab hi CRM hai — `status` se filter

> [!caution] Compliance
> Sirf opt-in logo ko message bhejo. WhatsApp/IG/email anti-spam rules respect karo warna ban ho sakta hai.

---

## 🔗 Related Files

- [[README]] — full setup guide (`automation/README.md`)
- `automation/templates/messages.md` — saari message copy
- `automation/templates/content-calendar.csv` — broadcast posts
- `automation/sheets/crm-template.csv` — CRM template
- `automation/n8n-workflows/` — 5 workflow JSONs

---
*Status: ✅ Built & pushed to `claude/n8n-marketing-automation-c1k4w7`. Deploy karne ke liye upar wala checklist follow karo.*
