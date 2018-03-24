import './appsscript.json';

const DATE_CHANGE_HOUR = 4; // 日付の切り替わり時間。午前4時にシートを切り替える

function getActiveUsers() {
  const ids = process.env.GA_VIEW_ID;
  const metrics = 'rt:activeUsers';
  const time = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss');
  const res = Analytics.Data.Realtime.get(ids, metrics);
  const activeUsers = res.totalsForAllResults['rt:activeUsers'];
  Logger.log({ time, activeUsers });
  return { time, activeUsers };
}

/**
 * 日付に対応した名称のシートを取得する。なければ作る。
 * 日替わりの時間は DATE_CHANGE_HOUR で指定。
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const date = new Date();
  date.setHours(date.getHours() - DATE_CHANGE_HOUR);
  const sheetName = Utilities.formatDate(date, 'JST', "'au_'yyyyMMdd");
  let sheet = ss.getSheetByName(sheetName);
  if (sheet == null) {
    // TODO TEMPLATEをコピーする処理
    sheet = ss.insertSheet(sheetName);
    sheet.getRange('A1:B1').setValues([['日時', 'アクティブユーザ数']]);
  }
  return sheet;
}

function appendData(data) {
  const sheet = getOrCreateSheet();
  sheet.appendRow(data);
}

function deleteSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (sheet) ss.deleteSheet(sheet);
}

function delelteSheets() {
  Logger.log('delelteSheets');
  for (let i = 10; i <= 31; i += 1) {
    const sheetName = `au_201712${i}`;// + "g"
    Logger.log(sheetName);
    deleteSheet(sheetName);
  }
}

/**
 * 定期的に実行する関数
 */
function exec() {
  const res = getActiveUsers();
  Logger.log(res);
  appendData(res);
}

function temp() {
  for (let i = 10; i < 31; i += 1) {
    deleteSheet(`au_201707${i}`);
  }
}

function getFile() {
  const files = DriveApp.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    console.info(file.getName());
  }
}

global.delelteSheets = delelteSheets;
global.exec = exec;
global.temp = temp;
global.getFile = getFile;
global.getActiveUsers = getActiveUsers;
