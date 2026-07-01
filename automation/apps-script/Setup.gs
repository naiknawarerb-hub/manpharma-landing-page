/**
 * ManPharma Sales Engine — SETUP (ek baar chalao)
 */

/**
 * 1) CRM sheet ke tabs + headers bana deta hai (agar nahi hain).
 *    Pehle Config me SHEET_ID set karo.
 */
function setupSheet() {
  var ss = ss_();

  // Leads tab
  var leads = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
  if (leads.getLastRow() === 0) leads.appendRow(LEAD_COLS);

  // Content tab (broadcast calendar)
  var content = ss.getSheetByName('Content') || ss.insertSheet('Content');
  if (content.getLastRow() === 0) content.appendRow(['id', 'day', 'channel', 'type', 'message', 'image_url', 'status', 'sent_at']);

  // Subscribers tab (WhatsApp broadcast list)
  var subs = ss.getSheetByName('Subscribers') || ss.insertSheet('Subscribers');
  if (subs.getLastRow() === 0) subs.appendRow(['phone', 'name', 'opted_in']);

  Logger.log('✅ Sheet setup done. Tabs: Leads, Content, Subscribers.');
}

/**
 * 2) Time-driven triggers install karta hai:
 *    - Drip nurture:  roz subah 10 baje
 *    - Broadcast:     roz shaam 6 baje (function khud Mon/Wed/Fri check karta hai)
 *    - Daily report:  roz raat 9 baje
 *    Dubaara chalao to purane trigger clear karke naye banata hai.
 */
function setupTriggers() {
  // purane manage kiye triggers hatao
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    var fn = existing[i].getHandlerFunction();
    if (fn === 'runDripNurture' || fn === 'broadcastGate_' || fn === 'sendDailyReport') {
      ScriptApp.deleteTrigger(existing[i]);
    }
  }

  ScriptApp.newTrigger('runDripNurture').timeBased().everyDays(1).atHour(10).create();
  ScriptApp.newTrigger('broadcastGate_').timeBased().everyDays(1).atHour(18).create();
  ScriptApp.newTrigger('sendDailyReport').timeBased().everyDays(1).atHour(21).create();

  Logger.log('✅ Triggers set: drip 10:00, broadcast 18:00 (Mon/Wed/Fri), report 21:00.');
}

/** Broadcast sirf Mon/Wed/Fri chale. */
function broadcastGate_() {
  var day = new Date().getDay(); // 0=Sun ... 1=Mon,3=Wed,5=Fri
  if (day === 1 || day === 3 || day === 5) runBroadcast();
}

/**
 * 3) Sab kuch ek saath: sheet + triggers.
 */
function initSalesEngine() {
  setupSheet();
  setupTriggers();
  Logger.log('🚀 ManPharma Sales Engine ready!');
}

/**
 * Telegram bot ka webhook is web app se jodne ke liye ek baar chalao.
 * Pehle web app deploy karke uska URL Config/Script property me daalna nahi padta —
 * bas neeche WEB_APP_URL variable me apna deployed /exec URL daalo.
 */
function registerTelegramWebhook() {
  var cfg = getConfig();
  var WEB_APP_URL = 'PASTE_YOUR_DEPLOYED_WEB_APP_/exec_URL_HERE';
  var hook = WEB_APP_URL + '?action=telegram';
  var url = 'https://api.telegram.org/bot' + cfg.TELEGRAM_BOT_TOKEN + '/setWebhook?url=' + encodeURIComponent(hook);
  var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  Logger.log(res.getContentText());
}

/** Quick smoke test — apna Telegram chat id daal ke chalao. */
function testLeadCapture() {
  var out = captureLead_({ name: 'Test', contact: 'YOUR_TELEGRAM_CHAT_ID', channel: 'telegram', source: 'test' });
  Logger.log(JSON.stringify(out));
}
