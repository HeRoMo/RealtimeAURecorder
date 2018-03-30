import getSettings from './settings';
import fetchActiveUsers from './ga';
import Sheets from './sheets';

/**
 * 設定された1つのサイトのデータを処理する
 * @param  {Object} setting 1件分の設定。
 */
function recordAU(setting) {
  const auData = fetchActiveUsers(setting.ga_view_id);
  const baseDirId = setting.base_dir;
  const sheet = new Sheets(baseDirId);
  sheet.appendData(auData);
}

/**
 * 定期的に実行する関数
 */
function exec() {
  const settings = getSettings();
  settings.forEach(setting => recordAU(setting));
}

function setUp() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('settingsSsId', SpreadsheetApp.getActiveSpreadsheet().getId());
}

function getSettingsSsId() {
  const scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty('settingsSsId');
}

global.exec = exec;
global.setUp = setUp;
global.getSettingsSsId = getSettingsSsId;
