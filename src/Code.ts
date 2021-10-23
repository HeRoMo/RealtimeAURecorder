import AppSettings, { Setting } from './AppSettings';
import { GaClient } from './GaClient';
import Sheets from './Sheets';

/**
 * 設定された1つのサイトのデータを処理する
 * @param setting 1件分の設定。
 */
function recordAU(setting: Setting): void {
  const auData = GaClient.getActiveUsers(setting.ga_view_id);
  const baseDirId = setting.base_dir;
  const sheet = new Sheets(baseDirId);
  sheet.appendData(auData);
}

/**
 * すべての設定のデータを処理し、アクティブユーザを記録する。
 * 定期的に実行することを想定。
 */
function recordAUAll() { // eslint-disable-line @typescript-eslint/no-unused-vars
  const settings = new AppSettings().getAll();
  settings.forEach((setting) => recordAU(setting));
}

/**
 * ScriptPropertyにコンテナドキュメントのIDを保存する。
 */
function setUp() { // eslint-disable-line @typescript-eslint/no-unused-vars
  AppSettings.setUp();
}
