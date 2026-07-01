/**
 * ============================================================
 *  ManPharma SALES ENGINE — ALL-IN-ONE (single file)
 * ============================================================
 *  Standalone project ke liye. Steps:
 *  1) https://script.google.com/create  (naya project)
 *  2) Ye poora code Code.gs me paste karo (default content hata ke)
 *  3) Neeche CONFIG me tokens bharo (SHEET_ID already set hai)
 *  4) Run -> initSalesEngine  (permissions approve karo)
 *  5) Deploy -> New deployment -> Web app (execute: Me, access: Anyone)
 * ============================================================
 */

/* ------------------------------------------------------------
 *  CONFIG  — yahan settings bharo
 * ---------------------------------------------------------- */
function getConfig() {
  var P = PropertiesService.getScriptProperties();
  function prop(key, fallback) { return P.getProperty(key) || fallback; }

  return {
    // CRM sheet (already tumhari ID daali hai)
    SHEET_ID: prop('SHEET_ID', '1uSM-F45u2pYISVAyCn_XdpohVBvJKAfRwLfSyUHLo1g'),

    // Owner / admin
    ADMIN_EMAIL: prop('ADMIN_EMAIL', 'naiknawarerb@gmail.com'),
    FROM_NAME: 'ManPharma Tutorials',

    // Telegram (start here — free)
    TELEGRAM_BOT_TOKEN: prop('TELEGRAM_BOT_TOKEN', 'YOUR_TELEGRAM_BOT_TOKEN'),
    TELEGRAM_CHANNEL_ID: prop('TELEGRAM_CHANNEL_ID', '@yourchannel'),
    ADMIN_TELEGRAM_CHAT_ID: prop('ADMIN_TELEGRAM_CHAT_ID', 'YOUR_ADMIN_CHAT_ID'),

    // WhatsApp Business Cloud API (optional)
    WA_PHONE_NUMBER_ID: prop('WA_PHONE_NUMBER_ID', 'YOUR_WA_PHONE_NUMBER_ID'),
    WA_TOKEN: prop('WA_TOKEN', 'YOUR_WA_TOKEN'),

    // Instagram (optional)
    IG_BUSINESS_ID: prop('IG_BUSINESS_ID', 'YOUR_IG_BUSINESS_ID'),
    IG_TOKEN: prop('IG_TOKEN', 'YOUR_IG_TOKEN'),

    // Web app calls ka shared secret
    WEBHOOK_SECRET: prop('WEBHOOK_SECRET', 'change-me'),

    // Links
    CHECKOUT: 'https://ramannaiknaware.graphy.com/courses/DPharm-1st-year-Pharmaceutics-Complete-Notes-69883bcbc8266f1243b25fed',
    COMBO: 'https://ramannaiknaware.graphy.com/courses/DPharm-1st-Year-Combo-1777537319930-69f311273e897b00ec94531a',
    SAMPLE: 'https://drive.google.com/file/d/1rHrKPCAWHzfMvzjK2drLs-l34tzHswcT/view?usp=sharing'
  };
}

var LEAD_COLS = ['lead_id', 'name', 'channel', 'contact', 'subject_interest',
  'source', 'status', 'stage', 'date_added', 'last_message_at', 'next_action_at', 'notes'];

function MESSAGES(cfg) {
  return {
    welcome: function (n) { return 'Hi ' + n + '! 👋 ManPharma Tutorials me welcome hai.\n\n📥 Free sample: ' + cfg.SAMPLE + '\n\nNotes MSBTE ER20-11T syllabus par based hain — diagrams + Hinglish ke saath. Koi sawaal ho to reply karo. 🙌'; },
    stage1: function (n) { return n + ', ek quick tip 📚\nPharmaceutics me Dosage Forms, Sterile Formulations aur Packaging har exam me aate hain. Hamari notes me ready answers + diagrams hain.\nSample: ' + cfg.SAMPLE; },
    stage2: function (n) { return n + ', 500+ students in notes se padh rahe hain ⭐ "Score 20 marks badh gaya" — common feedback.\n🔥 Early-bird ₹69 (first 30 students), phir ₹99.\nLock karo 👉 ' + cfg.CHECKOUT; },
    stage3: function (n) { return n + ', notes lene chahiye? ✅ MSBTE ER20 chapters ✅ Diagrams+Hinglish ✅ Lifetime access ✅ Sirf ₹69.\nSecure payment 👉 ' + cfg.CHECKOUT; },
    stage4: function (n) { return '⏳ ' + n + ', last reminder! Early-bird ₹69 khatam hone wala hai, phir ₹99.\nCombo me zyada bachat 👉 ' + cfg.COMBO + '\nSingle 👉 ' + cfg.CHECKOUT; },
    thankyou: function (n) { return '🎉 Thank you ' + n + '! Payment mil gayi — notes ab account me available hain.\n\n📈 Ek aur subject? Combo me bachat 👉 ' + cfg.COMBO + '\n\n🎁 Doston ko refer karo: ' + cfg.CHECKOUT + '\n\nAll the best! 💪'; },
    price: function () { return '💰 Pricing:\n• Early-bird ₹69 (first 30)\n• Regular ₹99\n• Combo me aur bachat!\nBuy 👉 ' + cfg.CHECKOUT; },
    syllabus: function () { return '📚 Notes MSBTE ER20-11T Pharmaceutics ke exact chapters cover karti hain — Dosage Forms, Sterile Formulations, Packaging, Stability + diagrams.\nBuy 👉 ' + cfg.CHECKOUT; },
    sample: function () { return '📥 FREE sample: ' + cfg.SAMPLE + '\nPasand aaye to ₹69 me poori notes 👉 ' + cfg.CHECKOUT; },
    buy: function () { return '🛒 Secure checkout (UPI/Card/NetBanking):\n' + cfg.CHECKOUT + '\nCombo 👉 ' + cfg.COMBO; },
    menu: function () { return 'Hi! 👋 Main ManPharma helper hoon. Type karo:\n• "price" — kimat\n• "sample" — free demo\n• "syllabus" — kya cover hota hai\n• "buy" — kharidne ka link'; }
  };
}

/* ------------------------------------------------------------
 *  SHEET helpers
 * ---------------------------------------------------------- */
function ss_() { return SpreadsheetApp.openById(getConfig().SHEET_ID); }
function leadsSheet_() { return ss_().getSheetByName('Leads'); }

function readLeads_() {
  var sh = leadsSheet_();
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0], out = [];
  for (var i = 1; i < values.length; i++) {
    var obj = { _row: i + 1 };
    for (var c = 0; c < headers.length; c++) obj[headers[c]] = values[i][c];
    out.push(obj);
  }
  return out;
}

function findLeadByContact_(contact) {
  var leads = readLeads_();
  for (var i = 0; i < leads.length; i++) {
    if (String(leads[i].contact) === String(contact)) return leads[i];
  }
  return null;
}

function appendLead_(lead) {
  var sh = leadsSheet_();
  sh.appendRow(LEAD_COLS.map(function (k) { return lead[k] !== undefined ? lead[k] : ''; }));
}

function updateLeadRow_(rowIndex, patch) {
  var sh = leadsSheet_();
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  for (var key in patch) {
    var col = headers.indexOf(key);
    if (col > -1) sh.getRange(rowIndex, col + 1).setValue(patch[key]);
  }
}

function today_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Kolkata', 'yyyy-MM-dd'); }
function addDays_(days) { return Utilities.formatDate(new Date(Date.now() + days * 86400000), Session.getScriptTimeZone() || 'Asia/Kolkata', 'yyyy-MM-dd'); }

function readContent_() {
  var sh = ss_().getSheetByName('Content');
  if (!sh) return [];
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0], out = [];
  for (var i = 1; i < values.length; i++) {
    var obj = { _row: i + 1 };
    for (var c = 0; c < headers.length; c++) obj[headers[c]] = values[i][c];
    out.push(obj);
  }
  return out;
}

function updateContentRow_(rowIndex, patch) {
  var sh = ss_().getSheetByName('Content');
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  for (var key in patch) {
    var col = headers.indexOf(key);
    if (col > -1) sh.getRange(rowIndex, col + 1).setValue(patch[key]);
  }
}

function readSubscriberPhones_() {
  var sh = ss_().getSheetByName('Subscribers');
  if (!sh) return [];
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0], pi = headers.indexOf('phone');
  if (pi < 0) return [];
  var out = [];
  for (var i = 1; i < values.length; i++) { if (values[i][pi]) out.push(String(values[i][pi])); }
  return out;
}

/* ------------------------------------------------------------
 *  CHANNELS
 * ---------------------------------------------------------- */
function sendMessage_(channel, contact, text) {
  channel = String(channel || '').toLowerCase();
  try {
    if (channel === 'telegram') return sendTelegram_(contact, text);
    if (channel === 'whatsapp') return sendWhatsApp_(contact, text);
    if (channel === 'email') return sendEmail_(contact, 'ManPharma Tutorials 📚', text);
    if (channel === 'instagram') return sendInstagram_(contact, text);
  } catch (err) { Logger.log('sendMessage_ error (' + channel + '): ' + err); }
  return false;
}

function sendTelegram_(chatId, text) {
  var cfg = getConfig();
  var res = UrlFetchApp.fetch('https://api.telegram.org/bot' + cfg.TELEGRAM_BOT_TOKEN + '/sendMessage', {
    method: 'post', contentType: 'application/json',
    payload: JSON.stringify({ chat_id: chatId, text: text, disable_web_page_preview: false }),
    muteHttpExceptions: true
  });
  return res.getResponseCode() === 200;
}

function sendEmail_(to, subject, text) {
  MailApp.sendEmail({ to: to, subject: subject, body: text, name: getConfig().FROM_NAME });
  return true;
}

function sendWhatsApp_(phone, text) {
  var cfg = getConfig();
  var res = UrlFetchApp.fetch('https://graph.facebook.com/v19.0/' + cfg.WA_PHONE_NUMBER_ID + '/messages', {
    method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + cfg.WA_TOKEN },
    payload: JSON.stringify({ messaging_product: 'whatsapp', to: String(phone), type: 'text', text: { body: text } }),
    muteHttpExceptions: true
  });
  return res.getResponseCode() < 300;
}

function sendInstagram_(igUserId, text) {
  var cfg = getConfig();
  var res = UrlFetchApp.fetch('https://graph.facebook.com/v19.0/' + cfg.IG_BUSINESS_ID + '/messages', {
    method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + cfg.IG_TOKEN },
    payload: JSON.stringify({ recipient: { id: String(igUserId) }, message: { text: text } }),
    muteHttpExceptions: true
  });
  return res.getResponseCode() < 300;
}

function alertOwner_(text) {
  var cfg = getConfig();
  try { if (cfg.ADMIN_TELEGRAM_CHAT_ID && cfg.ADMIN_TELEGRAM_CHAT_ID.indexOf('YOUR_') !== 0) sendTelegram_(cfg.ADMIN_TELEGRAM_CHAT_ID, text); } catch (e) {}
  try { sendEmail_(cfg.ADMIN_EMAIL, 'ManPharma — Sales Engine', text); } catch (e) {}
}

/* ------------------------------------------------------------
 *  SALES TEAM (roles)
 * ---------------------------------------------------------- */

// 🧲 SDR / Lead Gen
function captureLead_(data) {
  var cfg = getConfig();
  var contact = String(data.contact || data.email || data.phone || '');
  if (!contact) return { ok: false, error: 'no contact' };
  if (findLeadByContact_(contact)) return { ok: true, dup: true, message: 'already a lead' };

  var channel = String(data.channel || (contact.indexOf('@') > -1 ? 'email' : 'whatsapp')).toLowerCase();
  var name = data.name || 'Student';
  var lead = {
    lead_id: 'LEAD-' + String(Date.now()).slice(-8), name: name, channel: channel, contact: contact,
    subject_interest: data.subject_interest || data.subject || 'Pharmaceutics',
    source: data.source || 'landing_page', status: 'New', stage: 0,
    date_added: today_(), last_message_at: today_(), next_action_at: addDays_(1), notes: 'Auto-captured'
  };
  appendLead_(lead);
  sendMessage_(channel, contact, MESSAGES(cfg).welcome(name));
  return { ok: true, lead_id: lead.lead_id };
}

// 💬 Responder
function replyForText_(text) {
  var M = MESSAGES(getConfig());
  var t = String(text || '').toLowerCase();
  if (/(price|₹|cost|kitne|kimat|paisa|rate)/.test(t)) return M.price();
  if (/(syllabus|chapter|topic|cover|content)/.test(t)) return M.syllabus();
  if (/(sample|demo|free|trial)/.test(t)) return M.sample();
  if (/(buy|kharid|link|payment|purchase|order)/.test(t)) return M.buy();
  return M.menu();
}

function handleInbound_(data) {
  var contact, channel, text, name;
  if (data.message) {
    var m = data.message;
    contact = String(m.chat.id); channel = 'telegram'; text = m.text || '';
    name = (m.from && (m.from.first_name || m.from.username)) || 'Student';
  } else {
    contact = String(data.contact || data.from || data.sender || '');
    channel = String(data.channel || 'whatsapp').toLowerCase();
    text = data.text || data.message_text || ''; name = data.name || 'Student';
  }
  if (!contact) return { ok: false };
  sendMessage_(channel, contact, replyForText_(text));
  if (!findLeadByContact_(contact)) captureLead_({ name: name, contact: contact, channel: channel, source: channel });
  return { ok: true };
}

// 🤝 Closer (daily)
function runDripNurture() {
  var cfg = getConfig(), M = MESSAGES(cfg), leads = readLeads_(), t = today_(), sent = 0;
  for (var i = 0; i < leads.length; i++) {
    var r = leads[i], status = String(r.status || '').toLowerCase();
    if (status !== 'new' && status !== 'nurturing') continue;
    if (r.next_action_at && String(r.next_action_at) > t) continue;

    var nextStage = Number(r.stage || 0) + 1, text = null, days = 0;
    if (nextStage === 1) { text = M.stage1(r.name); days = 1; }
    else if (nextStage === 2) { text = M.stage2(r.name); days = 2; }
    else if (nextStage === 3) { text = M.stage3(r.name); days = 2; }
    else if (nextStage === 4) { text = M.stage4(r.name); days = 0; }

    if (!text) { updateLeadRow_(r._row, { status: 'Lost', stage: nextStage, last_message_at: t, next_action_at: '' }); continue; }
    sendMessage_(r.channel, r.contact, text);
    updateLeadRow_(r._row, { status: 'Nurturing', stage: nextStage, last_message_at: t, next_action_at: days > 0 ? addDays_(days) : '' });
    sent++;
  }
  Logger.log('Drip sent: ' + sent);
  return sent;
}

// 📣 Outreach
function runBroadcast() {
  var cfg = getConfig(), rows = readContent_(), post = null;
  for (var i = 0; i < rows.length; i++) { if (String(rows[i].status || '').toLowerCase() === 'pending') { post = rows[i]; break; } }
  if (!post) { Logger.log('No pending broadcast post.'); return false; }
  var msg = post.message;
  try { sendTelegram_(cfg.TELEGRAM_CHANNEL_ID, msg); } catch (e) {}
  try { sendEmail_(cfg.ADMIN_EMAIL, 'ManPharma 📚 ' + (post.type || 'Update'), msg); } catch (e) {}
  var phones = readSubscriberPhones_();
  for (var p = 0; p < phones.length; p++) { try { sendWhatsApp_(phones[p], msg); } catch (e) {} Utilities.sleep(300); }
  updateContentRow_(post._row, { status: 'sent', sent_at: today_() });
  Logger.log('Broadcast sent: ' + post.id);
  return true;
}

// 💳 Account Manager
function handlePurchase_(data) {
  var cfg = getConfig(), M = MESSAGES(cfg);
  var contact = String(data.contact || data.phone || data.email || '');
  var name = data.name || 'Student', amount = data.amount || '69';
  var channel = String(data.channel || (contact.indexOf('@') > -1 ? 'email' : 'whatsapp')).toLowerCase();
  var lead = findLeadByContact_(contact);
  if (lead) {
    updateLeadRow_(lead._row, { status: 'Customer', stage: 5, last_message_at: today_(), next_action_at: '', notes: 'Paid ₹' + amount + ' - upsell sent' });
    name = lead.name || name; channel = lead.channel || channel;
  }
  if (contact) sendMessage_(channel, contact, M.thankyou(name));
  alertOwner_('🟢 NEW SALE!\nName: ' + name + '\nChannel: ' + channel + '\nContact: ' + contact + '\nAmount: ₹' + amount + '\nTime: ' + new Date());
  return { ok: true };
}

// 📊 Sales Manager
function sendDailyReport() {
  var leads = readLeads_(), t = today_();
  var counts = { New: 0, Nurturing: 0, Hot: 0, Customer: 0, Lost: 0 };
  var dueToday = 0, addedToday = 0, soldToday = 0;
  for (var i = 0; i < leads.length; i++) {
    var r = leads[i], s = String(r.status || '');
    if (counts[s] !== undefined) counts[s]++;
    if (r.next_action_at && String(r.next_action_at) <= t && (s === 'New' || s === 'Nurturing')) dueToday++;
    if (String(r.date_added) === t) addedToday++;
    if (s === 'Customer' && String(r.last_message_at) === t) soldToday++;
  }
  var body = '📊 ManPharma — Daily Sales Report (' + t + ')\n\nPipeline:\n' +
    '• 🆕 New: ' + counts.New + '\n• 🌱 Nurturing: ' + counts.Nurturing + '\n• 🔥 Hot: ' + counts.Hot +
    '\n• ✅ Customers: ' + counts.Customer + '\n• ❄️ Lost: ' + counts.Lost + '\n\nAaj:\n' +
    '• Naye leads: ' + addedToday + '\n• Follow-ups due: ' + dueToday + '\n• Sales: ' + soldToday + '\n\nKeep closing! 💪';
  alertOwner_(body);
  Logger.log(body);
  return body;
}

/* ------------------------------------------------------------
 *  WEB APP endpoints
 * ---------------------------------------------------------- */
function doPost(e) {
  var cfg = getConfig();
  var action = (e && e.parameter && e.parameter.action) || '';
  var data = {};
  try { data = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { data = {}; }

  if (action === 'telegram' || data.update_id) { handleInbound_(data); return json_({ ok: true }); }

  if (action === 'lead' || action === 'inbound' || action === 'purchase') {
    if (String(data.secret || '') !== String(cfg.WEBHOOK_SECRET)) return json_({ ok: false, error: 'unauthorized' });
  }

  var result;
  if (action === 'lead') result = captureLead_(data);
  else if (action === 'inbound') result = handleInbound_(data);
  else if (action === 'purchase') result = handlePurchase_(data);
  else result = { ok: false, error: 'unknown action' };
  return json_(result);
}

function doGet(e) { return json_({ ok: true, service: 'ManPharma Sales Engine', time: new Date() }); }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

/* ------------------------------------------------------------
 *  SETUP — ek baar chalao
 * ---------------------------------------------------------- */
function setupSheet() {
  var ss = ss_();
  var leads = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
  if (leads.getLastRow() === 0) leads.appendRow(LEAD_COLS);
  var content = ss.getSheetByName('Content') || ss.insertSheet('Content');
  if (content.getLastRow() === 0) content.appendRow(['id', 'day', 'channel', 'type', 'message', 'image_url', 'status', 'sent_at']);
  var subs = ss.getSheetByName('Subscribers') || ss.insertSheet('Subscribers');
  if (subs.getLastRow() === 0) subs.appendRow(['phone', 'name', 'opted_in']);
  Logger.log('✅ Sheet setup done. Tabs: Leads, Content, Subscribers.');
}

function setupTriggers() {
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    var fn = existing[i].getHandlerFunction();
    if (fn === 'runDripNurture' || fn === 'broadcastGate_' || fn === 'sendDailyReport') ScriptApp.deleteTrigger(existing[i]);
  }
  ScriptApp.newTrigger('runDripNurture').timeBased().everyDays(1).atHour(10).create();
  ScriptApp.newTrigger('broadcastGate_').timeBased().everyDays(1).atHour(18).create();
  ScriptApp.newTrigger('sendDailyReport').timeBased().everyDays(1).atHour(21).create();
  Logger.log('✅ Triggers set: drip 10:00, broadcast 18:00 (Mon/Wed/Fri), report 21:00.');
}

function broadcastGate_() {
  var day = new Date().getDay();
  if (day === 1 || day === 3 || day === 5) runBroadcast();
}

function initSalesEngine() {
  setupSheet();
  setupTriggers();
  Logger.log('🚀 ManPharma Sales Engine ready!');
}

function registerTelegramWebhook() {
  var cfg = getConfig();
  var WEB_APP_URL = 'PASTE_YOUR_DEPLOYED_WEB_APP_/exec_URL_HERE';
  var url = 'https://api.telegram.org/bot' + cfg.TELEGRAM_BOT_TOKEN + '/setWebhook?url=' + encodeURIComponent(WEB_APP_URL + '?action=telegram');
  Logger.log(UrlFetchApp.fetch(url, { muteHttpExceptions: true }).getContentText());
}

function testLeadCapture() {
  Logger.log(JSON.stringify(captureLead_({ name: 'Test', contact: 'YOUR_TELEGRAM_CHAT_ID', channel: 'telegram', source: 'test' })));
}
