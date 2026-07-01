/**
 * ManPharma Sales Engine — CONFIG
 * ------------------------------------------------------------
 * Ek jagah saari settings. Tokens ko securely rakhne ke liye
 * PropertiesService use karo (Project Settings → Script properties),
 * warna neeche ke fallback values me daal do (testing ke liye theek hai).
 */
function getConfig() {
  var P = PropertiesService.getScriptProperties();
  function prop(key, fallback) { return P.getProperty(key) || fallback; }

  return {
    // ---- Google Sheet (CRM) ----
    SHEET_ID: prop('SHEET_ID', 'YOUR_SHEET_ID'),

    // ---- Owner / admin ----
    ADMIN_EMAIL: prop('ADMIN_EMAIL', 'naiknawarerb@gmail.com'),
    FROM_NAME: 'ManPharma Tutorials',

    // ---- Telegram ----
    TELEGRAM_BOT_TOKEN: prop('TELEGRAM_BOT_TOKEN', 'YOUR_TELEGRAM_BOT_TOKEN'),
    TELEGRAM_CHANNEL_ID: prop('TELEGRAM_CHANNEL_ID', '@yourchannel'),
    ADMIN_TELEGRAM_CHAT_ID: prop('ADMIN_TELEGRAM_CHAT_ID', 'YOUR_ADMIN_CHAT_ID'),

    // ---- WhatsApp Business Cloud API ----
    WA_PHONE_NUMBER_ID: prop('WA_PHONE_NUMBER_ID', 'YOUR_WA_PHONE_NUMBER_ID'),
    WA_TOKEN: prop('WA_TOKEN', 'YOUR_WA_TOKEN'),

    // ---- Instagram (Meta Graph API) ----
    IG_BUSINESS_ID: prop('IG_BUSINESS_ID', 'YOUR_IG_BUSINESS_ID'),
    IG_TOKEN: prop('IG_TOKEN', 'YOUR_IG_TOKEN'),

    // ---- Shared secret for web-app calls (website form / purchase) ----
    WEBHOOK_SECRET: prop('WEBHOOK_SECRET', 'change-me'),

    // ---- Links ----
    CHECKOUT: 'https://ramannaiknaware.graphy.com/courses/DPharm-1st-year-Pharmaceutics-Complete-Notes-69883bcbc8266f1243b25fed',
    COMBO: 'https://ramannaiknaware.graphy.com/courses/DPharm-1st-Year-Combo-1777537319930-69f311273e897b00ec94531a',
    SAMPLE: 'https://drive.google.com/file/d/1rHrKPCAWHzfMvzjK2drLs-l34tzHswcT/view?usp=sharing'
  };
}

/** Leads sheet columns (order matters — headers isi order me banenge). */
var LEAD_COLS = ['lead_id', 'name', 'channel', 'contact', 'subject_interest',
  'source', 'status', 'stage', 'date_added', 'last_message_at', 'next_action_at', 'notes'];

/**
 * Fixed Hinglish message copy. {name} placeholder replace hota hai.
 * Ye hi copy n8n version ke messages.md se match karti hai.
 */
function MESSAGES(cfg) {
  return {
    // Drip stages (0 welcome capture pe, phir 1..4)
    welcome: function (n) {
      return 'Hi ' + n + '! 👋 ManPharma Tutorials me welcome hai.\n\n📥 Free sample: ' + cfg.SAMPLE +
        '\n\nNotes MSBTE ER20-11T syllabus par based hain — diagrams + Hinglish ke saath. Koi sawaal ho to reply karo. 🙌';
    },
    stage1: function (n) {
      return n + ', ek quick tip 📚\nPharmaceutics me Dosage Forms, Sterile Formulations aur Packaging har exam me aate hain. Hamari notes me ready answers + diagrams hain.\nSample: ' + cfg.SAMPLE;
    },
    stage2: function (n) {
      return n + ', 500+ students in notes se padh rahe hain ⭐ "Score 20 marks badh gaya" — common feedback.\n🔥 Early-bird ₹69 (first 30 students), phir ₹99.\nLock karo 👉 ' + cfg.CHECKOUT;
    },
    stage3: function (n) {
      return n + ', notes lene chahiye? ✅ MSBTE ER20 chapters ✅ Diagrams+Hinglish ✅ Lifetime access ✅ Sirf ₹69.\nSecure payment 👉 ' + cfg.CHECKOUT;
    },
    stage4: function (n) {
      return '⏳ ' + n + ', last reminder! Early-bird ₹69 khatam hone wala hai, phir ₹99.\nCombo me zyada bachat 👉 ' + cfg.COMBO + '\nSingle 👉 ' + cfg.CHECKOUT;
    },
    // Conversion
    thankyou: function (n) {
      return '🎉 Thank you ' + n + '! Payment mil gayi — notes ab account me available hain.\n\n📈 Ek aur subject? Combo me bachat 👉 ' + cfg.COMBO +
        '\n\n🎁 Doston ko refer karo: ' + cfg.CHECKOUT + '\n\nAll the best! 💪';
    },
    // Inbound keyword replies
    price: function () { return '💰 Pricing:\n• Early-bird ₹69 (first 30)\n• Regular ₹99\n• Combo me aur bachat!\nBuy 👉 ' + cfg.CHECKOUT; },
    syllabus: function () { return '📚 Notes MSBTE ER20-11T Pharmaceutics ke exact chapters cover karti hain — Dosage Forms, Sterile Formulations, Packaging, Stability + diagrams.\nBuy 👉 ' + cfg.CHECKOUT; },
    sample: function () { return '📥 FREE sample: ' + cfg.SAMPLE + '\nPasand aaye to ₹69 me poori notes 👉 ' + cfg.CHECKOUT; },
    buy: function () { return '🛒 Secure checkout (UPI/Card/NetBanking):\n' + cfg.CHECKOUT + '\nCombo 👉 ' + cfg.COMBO; },
    menu: function () { return 'Hi! 👋 Main ManPharma helper hoon. Type karo:\n• "price" — kimat\n• "sample" — free demo\n• "syllabus" — kya cover hota hai\n• "buy" — kharidne ka link'; }
  };
}
