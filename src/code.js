import './appsscript.json';

import fetchActiveUsers from './ga';
import Sheets from './sheets';

function getActiveUsers() {
  const au = fetchActiveUsers(process.env.GA_VIEW_ID);
  return au;
}

function appendData(data) {
  const baseDirId = process.env.BASE_DIR_ID;
  const sheet = new Sheets(baseDirId);
  sheet.appendData(data);
}

/**
 * 定期的に実行する関数
 */
function exec() {
  const res = getActiveUsers();
  appendData(res);
}

global.exec = exec;
