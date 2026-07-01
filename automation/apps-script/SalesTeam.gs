/**
 * ManPharma Sales Engine — THE SALES TEAM (roles)
 * Har function ek "team member" ki tarah kaam karta hai.
 * ------------------------------------------------------------
 *  🧲 SDR / Lead Gen ....... captureLead_()      (web app + inbound)
 *  💬 Responder ............ handleInbound_()     (keyword auto-reply)
 *  🤝 Closer ............... runDripNurture()     (daily trigger)
 *  📣 Outreach ............. runBroadcast()       (Mon/Wed/Fri trigger)
 *  💳 Account Manager ...... handlePurchase_()    (conversion + upsell)
 *  📊 Sales Manager ........ sendDailyReport()    (daily trigger)
 */

// ---------- 🧲 SDR / LEAD GEN ----------
function captureLead_(data) {
  var cfg = getConfig();
  var contact = String(data.contact || data.email || data.phone || '');
  if (!contact) return { ok: false, error: 'no contact' };

  var existing = findLeadByContact_(contact);
  if (existing) return { ok: true, dup: true, message: 'already a lead' };

  var channel = String(data.channel || (contact.indexOf('@') > -1 ? 'email' : 'whatsapp')).toLowerCase();
  var name = data.name || 'Student';
  var lead = {
    lead_id: 'LEAD-' + String(Date.now()).slice(-8),
    name: name,
    channel: channel,
    contact: contact,
    subject_interest: data.subject_interest || data.subject || 'Pharmaceutics',
    source: data.source || 'landing_page',
    status: 'New',
    stage: 0,
    date_added: today_(),
    last_message_at: today_(),
    next_action_at: addDays_(1),
    notes: 'Auto-captured'
  };
  appendLead_(lead);
  sendMessage_(channel, contact, MESSAGES(cfg).welcome(name));
  return { ok: true, lead_id: lead.lead_id };
}

// ---------- 💬 RESPONDER (keyword auto-reply) ----------
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
  if (data.message) { // Telegram webhook update
    var m = data.message;
    contact = String(m.chat.id);
    channel = 'telegram';
    text = m.text || '';
    name = (m.from && (m.from.first_name || m.from.username)) || 'Student';
  } else {
    contact = String(data.contact || data.from || data.sender || '');
    channel = String(data.channel || 'whatsapp').toLowerCase();
    text = data.text || data.message_text || '';
    name = data.name || 'Student';
  }
  if (!contact) return { ok: false };

  // reply + lead ko capture bhi karo (naya ho to)
  sendMessage_(channel, contact, replyForText_(text));
  if (!findLeadByContact_(contact)) {
    captureLead_({ name: name, contact: contact, channel: channel, source: channel });
  }
  return { ok: true };
}

// ---------- 🤝 CLOSER (daily drip nurture) ----------
function runDripNurture() {
  var cfg = getConfig();
  var M = MESSAGES(cfg);
  var leads = readLeads_();
  var t = today_();
  var sent = 0;

  for (var i = 0; i < leads.length; i++) {
    var r = leads[i];
    var status = String(r.status || '').toLowerCase();
    if (status !== 'new' && status !== 'nurturing') continue;
    if (r.next_action_at && String(r.next_action_at) > t) continue;

    var nextStage = Number(r.stage || 0) + 1;
    var text = null, days = 0;
    if (nextStage === 1) { text = M.stage1(r.name); days = 1; }
    else if (nextStage === 2) { text = M.stage2(r.name); days = 2; }
    else if (nextStage === 3) { text = M.stage3(r.name); days = 2; }
    else if (nextStage === 4) { text = M.stage4(r.name); days = 0; }

    if (!text) { // funnel khatam, koi buy nahi -> Lost
      updateLeadRow_(r._row, { status: 'Lost', stage: nextStage, last_message_at: t, next_action_at: '' });
      continue;
    }

    sendMessage_(r.channel, r.contact, text);
    updateLeadRow_(r._row, {
      status: 'Nurturing',
      stage: nextStage,
      last_message_at: t,
      next_action_at: days > 0 ? addDays_(days) : ''
    });
    sent++;
  }
  Logger.log('Drip sent: ' + sent);
  return sent;
}

// ---------- 📣 OUTREACH (broadcast) ----------
function runBroadcast() {
  var cfg = getConfig();
  var rows = readContent_();
  var post = null;
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].status || '').toLowerCase() === 'pending') { post = rows[i]; break; }
  }
  if (!post) { Logger.log('No pending broadcast post.'); return false; }

  var msg = post.message;
  // Telegram channel
  try { sendTelegram_(cfg.TELEGRAM_CHANNEL_ID, msg); } catch (e) {}
  // Email blast to admin/list (BCC apni list ko)
  try { sendEmail_(cfg.ADMIN_EMAIL, 'ManPharma 📚 ' + (post.type || 'Update'), msg); } catch (e) {}
  // WhatsApp broadcast
  var phones = readSubscriberPhones_();
  for (var p = 0; p < phones.length; p++) {
    try { sendWhatsApp_(phones[p], msg); } catch (e) {}
    Utilities.sleep(300); // rate-limit friendly
  }
  updateContentRow_(post._row, { status: 'sent', sent_at: today_() });
  Logger.log('Broadcast sent: ' + post.id);
  return true;
}

// ---------- 💳 ACCOUNT MANAGER (conversion + upsell) ----------
function handlePurchase_(data) {
  var cfg = getConfig();
  var M = MESSAGES(cfg);
  var contact = String(data.contact || data.phone || data.email || '');
  var name = data.name || 'Student';
  var amount = data.amount || '69';
  var channel = String(data.channel || (contact.indexOf('@') > -1 ? 'email' : 'whatsapp')).toLowerCase();

  var lead = findLeadByContact_(contact);
  if (lead) {
    updateLeadRow_(lead._row, { status: 'Customer', stage: 5, last_message_at: today_(), next_action_at: '', notes: 'Paid ₹' + amount + ' - upsell sent' });
    name = lead.name || name;
    channel = lead.channel || channel;
  }
  if (contact) sendMessage_(channel, contact, M.thankyou(name));
  alertOwner_('🟢 NEW SALE!\nName: ' + name + '\nChannel: ' + channel + '\nContact: ' + contact + '\nAmount: ₹' + amount + '\nTime: ' + new Date());
  return { ok: true };
}

// ---------- 📊 SALES MANAGER (daily pipeline report) ----------
function sendDailyReport() {
  var cfg = getConfig();
  var leads = readLeads_();
  var t = today_();
  var counts = { New: 0, Nurturing: 0, Hot: 0, Customer: 0, Lost: 0 };
  var dueToday = 0, addedToday = 0, soldToday = 0;

  for (var i = 0; i < leads.length; i++) {
    var r = leads[i];
    var s = String(r.status || '');
    if (counts[s] !== undefined) counts[s]++;
    if (r.next_action_at && String(r.next_action_at) <= t && (s === 'New' || s === 'Nurturing')) dueToday++;
    if (String(r.date_added) === t) addedToday++;
    if (s === 'Customer' && String(r.last_message_at) === t) soldToday++;
  }

  var body = '📊 ManPharma — Daily Sales Report (' + t + ')\n\n' +
    'Pipeline:\n' +
    '• 🆕 New: ' + counts.New + '\n' +
    '• 🌱 Nurturing: ' + counts.Nurturing + '\n' +
    '• 🔥 Hot: ' + counts.Hot + '\n' +
    '• ✅ Customers: ' + counts.Customer + '\n' +
    '• ❄️ Lost: ' + counts.Lost + '\n\n' +
    'Aaj:\n' +
    '• Naye leads: ' + addedToday + '\n' +
    '• Follow-ups due: ' + dueToday + '\n' +
    '• Sales: ' + soldToday + '\n\n' +
    'Keep closing! 💪';

  alertOwner_(body);
  Logger.log(body);
  return body;
}
