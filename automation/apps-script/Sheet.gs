/**
 * ManPharma Sales Engine — SHEET helpers (CRM = Google Sheet)
 */

function ss_() {
  return SpreadsheetApp.openById(getConfig().SHEET_ID);
}

function leadsSheet_() {
  return ss_().getSheetByName('Leads');
}

/** Poori Leads sheet ko array-of-objects me padho (+ _row index). */
function readLeads_() {
  var sh = leadsSheet_();
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0];
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var obj = { _row: i + 1 };
    for (var c = 0; c < headers.length; c++) obj[headers[c]] = values[i][c];
    out.push(obj);
  }
  return out;
}

/** contact se lead dhundo (dedupe ke liye). */
function findLeadByContact_(contact) {
  var leads = readLeads_();
  for (var i = 0; i < leads.length; i++) {
    if (String(leads[i].contact) === String(contact)) return leads[i];
  }
  return null;
}

/** Naya lead append karo. lead = object with LEAD_COLS keys. */
function appendLead_(lead) {
  var sh = leadsSheet_();
  var row = LEAD_COLS.map(function (k) { return lead[k] !== undefined ? lead[k] : ''; });
  sh.appendRow(row);
}

/** Ek lead row update karo. patch = {col: value}. rowIndex = 1-based sheet row. */
function updateLeadRow_(rowIndex, patch) {
  var sh = leadsSheet_();
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  for (var key in patch) {
    var col = headers.indexOf(key);
    if (col > -1) sh.getRange(rowIndex, col + 1).setValue(patch[key]);
  }
}

function today_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Kolkata', 'yyyy-MM-dd');
}

function addDays_(days) {
  return Utilities.formatDate(new Date(Date.now() + days * 86400000), Session.getScriptTimeZone() || 'Asia/Kolkata', 'yyyy-MM-dd');
}

/** Content tab (broadcast calendar) padho. */
function readContent_() {
  var sh = ss_().getSheetByName('Content');
  if (!sh) return [];
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0];
  var out = [];
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

/** Subscribers tab (WhatsApp broadcast list) ke phone numbers. */
function readSubscriberPhones_() {
  var sh = ss_().getSheetByName('Subscribers');
  if (!sh) return [];
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0];
  var pi = headers.indexOf('phone');
  if (pi < 0) return [];
  var out = [];
  for (var i = 1; i < values.length; i++) {
    if (values[i][pi]) out.push(String(values[i][pi]));
  }
  return out;
}
