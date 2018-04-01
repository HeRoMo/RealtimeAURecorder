import Settings from './settings';
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
 * すべての設定のデータを処理し、アクティブユーザを記録する。
 * 定期的に実行することを想定。
 */
function recordAUAll() {
  const settings = new Settings().getAll();
  settings.forEach(setting => recordAU(setting));
}

/**
 * ScriptPropertyにコンテナドキュメントのIDを保存する。
 */
function setUp() {
  Settings.setUp();
}

global.recordAUAll = recordAUAll;
global.setUp = setUp;
