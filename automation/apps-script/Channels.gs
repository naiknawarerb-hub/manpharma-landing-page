/**
 * ManPharma Sales Engine — CHANNELS
 * Ek hi sendMessage() jo channel ke hisaab se route karta hai.
 */

function sendMessage_(channel, contact, text) {
  channel = String(channel || '').toLowerCase();
  try {
    if (channel === 'telegram') return sendTelegram_(contact, text);
    if (channel === 'whatsapp') return sendWhatsApp_(contact, text);
    if (channel === 'email') return sendEmail_(contact, 'ManPharma Tutorials 📚', text);
    if (channel === 'instagram') return sendInstagram_(contact, text);
  } catch (err) {
    Logger.log('sendMessage_ error (' + channel + '): ' + err);
  }
  return false;
}

function sendTelegram_(chatId, text) {
  var cfg = getConfig();
  var url = 'https://api.telegram.org/bot' + cfg.TELEGRAM_BOT_TOKEN + '/sendMessage';
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ chat_id: chatId, text: text, disable_web_page_preview: false }),
    muteHttpExceptions: true
  });
  return res.getResponseCode() === 200;
}

function sendEmail_(to, subject, text) {
  var cfg = getConfig();
  MailApp.sendEmail({ to: to, subject: subject, body: text, name: cfg.FROM_NAME });
  return true;
}

function sendWhatsApp_(phone, text) {
  var cfg = getConfig();
  var url = 'https://graph.facebook.com/v19.0/' + cfg.WA_PHONE_NUMBER_ID + '/messages';
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + cfg.WA_TOKEN },
    payload: JSON.stringify({
      messaging_product: 'whatsapp',
      to: String(phone),
      type: 'text',
      text: { body: text }
    }),
    muteHttpExceptions: true
  });
  return res.getResponseCode() < 300;
}

function sendInstagram_(igUserId, text) {
  var cfg = getConfig();
  var url = 'https://graph.facebook.com/v19.0/' + cfg.IG_BUSINESS_ID + '/messages';
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + cfg.IG_TOKEN },
    payload: JSON.stringify({ recipient: { id: String(igUserId) }, message: { text: text } }),
    muteHttpExceptions: true
  });
  return res.getResponseCode() < 300;
}

/** Owner (tumhe) ko alert — Telegram + Email dono. */
function alertOwner_(text) {
  var cfg = getConfig();
  try { if (cfg.ADMIN_TELEGRAM_CHAT_ID && cfg.ADMIN_TELEGRAM_CHAT_ID.indexOf('YOUR_') !== 0) sendTelegram_(cfg.ADMIN_TELEGRAM_CHAT_ID, text); } catch (e) {}
  try { sendEmail_(cfg.ADMIN_EMAIL, 'ManPharma — Sales Engine', text); } catch (e) {}
}
