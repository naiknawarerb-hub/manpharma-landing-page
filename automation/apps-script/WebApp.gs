/**
 * ManPharma Sales Engine — WEB APP (public endpoints)
 * Deploy → Web app → ek URL milega. Us URL par POST karo:
 *
 *   ?action=lead      -> website form / new lead        (SDR)
 *   ?action=inbound   -> incoming DM (WhatsApp/IG/etc.) (Responder)
 *   ?action=purchase  -> Graphy / manual sale event     (Account Manager)
 *   ?action=telegram  -> Telegram bot webhook           (Responder)
 *
 * Body JSON me `secret` bhejo (Config ke WEBHOOK_SECRET se match).
 * Telegram webhook ke liye secret skip hota hai (Telegram apna payload bhejta hai).
 */
function doPost(e) {
  var cfg = getConfig();
  var action = (e && e.parameter && e.parameter.action) || '';
  var data = {};
  try { data = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { data = {}; }

  // Telegram bot webhook -> hamesha inbound handle karo
  if (action === 'telegram' || data.update_id) {
    handleInbound_(data);
    return json_({ ok: true });
  }

  // Baaki endpoints ke liye shared secret check
  if (action === 'lead' || action === 'inbound' || action === 'purchase') {
    if (String(data.secret || '') !== String(cfg.WEBHOOK_SECRET)) {
      return json_({ ok: false, error: 'unauthorized' });
    }
  }

  var result;
  if (action === 'lead') result = captureLead_(data);
  else if (action === 'inbound') result = handleInbound_(data);
  else if (action === 'purchase') result = handlePurchase_(data);
  else result = { ok: false, error: 'unknown action' };

  return json_(result);
}

function doGet(e) {
  return json_({ ok: true, service: 'ManPharma Sales Engine', time: new Date() });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
