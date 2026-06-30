# ManPharma — Fixed Message Copy (Hinglish)

All copy used by the n8n workflows. Edit text here, then update the matching node
in the workflow JSON (or, better, keep these as the single source of truth and
paste into the Set/Telegram/Email nodes). Placeholders use `{{ }}` and are
filled by n8n expressions from the lead row.

Common placeholders:
- `{{name}}` — lead's name (fallback "Student")
- `{{sampleLink}}` — `https://drive.google.com/file/d/1rHrKPCAWHzfMvzjK2drLs-l34tzHswcT/view?usp=sharing`
- `{{checkoutLink}}` — `https://ramannaiknaware.graphy.com/courses/DPharm-1st-year-Pharmaceutics-Complete-Notes-69883bcbc8266f1243b25fed`
- `{{comboLink}}` — `https://ramannaiknaware.graphy.com/courses/DPharm-1st-Year-Combo-1777537319930-69f311273e897b00ec94531a`

---

## 1. Welcome (sent instantly at lead capture — Stage 0 / Day 0)

```
Hi {{name}}! 👋 ManPharma Tutorials me welcome hai.

Tumne D.Pharm Pharmaceutics ke exam-ready notes me interest dikhaya — bahut sahi choice! 🎯

📥 Ye lo FREE sample, quality khud check karo:
{{sampleLink}}

Notes MSBTE ER20-11T syllabus ke exact chapters par based hain — diagrams + Hinglish explanation ke saath. Koi sawaal ho to bas reply karo. 🙌
```

## 2. Drip — Day 1 (Stage 1): Value / important chapters

```
{{name}}, ek quick tip 📚

Pharmaceutics me ye chapters har exam me aate hain:
• Dosage Forms & Preparations
• Sterile Formulations (injectables, eye drops)
• Packaging & Stability

Hamari notes me in sab par ready-to-write answers + labelled diagrams hain — taaki exam me time bache.

Sample dekha? 👉 {{sampleLink}}
```

## 3. Drip — Day 2 (Stage 2): Social proof + early-bird urgency + checkout

```
{{name}}, 500+ D.Pharm students already in notes se padh rahe hain ⭐

"Score 20 marks badh gaya" — ye sabse common feedback hai.

🔥 Abhi EARLY-BIRD price sirf ₹69 hai (first 30 students ke liye). Uske baad ₹99.

Apni copy abhi lock karo 👉 {{checkoutLink}}
```

## 4. Drip — Day 4 (Stage 3): Objection-busting + checkout

```
{{name}}, soch rahe ho "notes kharidne chahiye ya nahi"? 🤔

• ✅ MSBTE ER20 syllabus ke exact chapters
• ✅ Diagrams + Hinglish — easy revision
• ✅ Lifetime access, mobile + laptop dono par
• ✅ Sirf ₹69 — ek samose se bhi kam, par poore semester kaam aayega 😄

Secure payment (UPI/Card/NetBanking) 👉 {{checkoutLink}}
```

## 5. Drip — Day 6 (Stage 4): Last chance + combo

```
⏳ {{name}}, ye last reminder hai!

Early-bird ₹69 offer khatam hone wala hai — uske baad ₹99 ho jayega.

Aur agar ek se zyada subject chahiye to COMBO me bahut bachat hai 👇
{{comboLink}}

Single subject 👉 {{checkoutLink}}
```

## 6. Inbound auto-reply (keyword based — Workflow 05)

**price / ₹ / cost / kitne ka**
```
💰 Pricing:
• Early-bird: ₹69 (first 30 students)
• Regular: ₹99
• 3-Subject Combo me aur bachat!
Buy karne ke liye 👉 {{checkoutLink}}
```

**syllabus / chapter / topics**
```
📚 Notes MSBTE ER20-11T Pharmaceutics syllabus ke exact chapters cover karti hain — Dosage Forms, Sterile Formulations, Packaging, Stability aur more. Saath me diagrams. Full details + buy 👉 {{checkoutLink}}
```

**sample / demo / free**
```
📥 Ye lo FREE sample, quality khud dekho:
{{sampleLink}}
Pasand aaye to ₹69 me poori notes lo 👉 {{checkoutLink}}
```

**buy / kharid / link / payment**
```
🛒 Yahan se secure checkout karo (UPI/Card/NetBanking):
{{checkoutLink}}
Combo chahiye to 👉 {{comboLink}}
```

**default / menu (koi keyword match nahi hua)**
```
Hi! 👋 Main ManPharma ka helper hoon. Type karo:
• "price" — kimat jaanne ke liye
• "sample" — free demo notes
• "syllabus" — kya kya cover hota hai
• "buy" — kharidne ka link
```

## 7. Conversion — thank-you + upsell + referral (Workflow 04)

```
🎉 Thank you {{name}}! Tumhari payment mil gayi — notes ab tumhare account me available hain.

📈 Ek aur subject add karna chahte ho? Combo me bahut bachat hai 👉 {{comboLink}}

🎁 Apne doston ko refer karo — unhe bhi best notes mil jayenge aur tumhari help bhi hogi. Bas ye link share karo: {{checkoutLink}}

All the best for your exams! 💪
```

## 8. Owner sale alert (internal — Telegram/email to admin)

```
🟢 NEW SALE!
Name: {{name}}
Channel: {{channel}}
Contact: {{contact}}
Subject: {{subject_interest}}
Time: {{now}}
```
