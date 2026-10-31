// Google Apps Script for Indusha & Anjana's invitation.
// Paste this whole file into Extensions > Apps Script (Code.gs) of the spreadsheet,
// then deploy it as a Web App (see google-apps-script/SETUP.md).

var SPREADSHEET_ID = '1yLuOjg_yEke48JMrlQ89EQvifk4V7ObFiuUrZ10nKeA';

// Each sheet is created automatically with these headers on first use.
var SHEETS = {
  RSVP: {
    headers: ['Timestamp', 'Full Name', 'Invited As', 'Guests', 'Attendance', 'Dietary Notes'],
    widths: [170, 220, 220, 80, 110, 320],
    row: function (p) {
      return [new Date(), p.name || '', p.invitedAs || '', p.guests || '', p.attendance || '', p.dietary || ''];
    },
  },
  Wishes: {
    headers: ['Timestamp', 'Guest Name', 'Message'],
    widths: [170, 220, 520],
    row: function (p) {
      return [new Date(), p.name || '', p.message || ''];
    },
  },
};

var HEADER_BACKGROUND = '#7B1E2B';
var HEADER_TEXT = '#FFFFFF';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var payload = parsePayload_(e);
    var sheetName = resolveSheetName_(payload.sheet);

    if (!sheetName) {
      return jsonResponse_({ result: 'error', error: 'Invalid sheet. Use RSVP or Wishes.' });
    }

    var sheet = getOrCreateSheet_(sheetName);
    sheet.appendRow(SHEETS[sheetName].row(payload));

    return jsonResponse_({ result: 'success', sheet: sheetName, row: sheet.getLastRow() });
  } catch (error) {
    return jsonResponse_({ result: 'error', error: String(error && error.message ? error.message : error) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse_({ result: 'success', message: 'Indusha & Anjana invitation endpoint is running.' });
}

// Run once from the Apps Script editor to create both sheets up front (optional).
function setup() {
  Object.keys(SHEETS).forEach(getOrCreateSheet_);
}

function resolveSheetName_(value) {
  var key = String(value || '').trim().toUpperCase();
  if (key === 'RSVP') return 'RSVP';
  if (key === 'WISHES' || key === 'WISH') return 'Wishes';
  return null;
}

function getOrCreateSheet_(name) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);

  if (sheet.getLastRow() === 0) {
    var config = SHEETS[name];
    var header = sheet.getRange(1, 1, 1, config.headers.length);

    header.setValues([config.headers])
      .setFontWeight('bold')
      .setBackground(HEADER_BACKGROUND)
      .setFontColor(HEADER_TEXT)
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    config.widths.forEach(function (width, i) {
      sheet.setColumnWidth(i + 1, width);
    });
  }

  return sheet;
}

function parsePayload_(e) {
  var params = e && e.parameter ? e.parameter : {};
  if (Object.keys(params).length > 0) return params;

  var contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) return {};

  try {
    return JSON.parse(contents);
  } catch (_error) {
    return {};
  }
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
