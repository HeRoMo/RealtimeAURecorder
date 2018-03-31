const SETTINGS_SHEET_NAME = 'SETTINGS';

/**
 * Range#getValues で取得した2次元配列をオブジェクトの配列に変換する。
 * ただし、1行目はヘッダ行であることを前提としている
 * @param  {Array[][]} values データを含む2次元配列
 * @return {Array[Object]} JSONに変換した配列
 */
function values2object(values) {
  const keys = values.shift();
  return values.map((row) => {
    const obj = {};
    row.forEach((val, index) => {
      obj[keys[index]] = val;
    });
    return obj;
  });
}

function getSettingsSsId() {
  const scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty('settingsSsId');
}

class Settings {
  /**
   * セットアップメソッド
   * 設定ファイルからスクリプトエディタを開き、一度実行すると、スクリプトプロパティに
   * 設定ファイルのIDを保存する。
   */
  static setUp() {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty('settingsSsId', SpreadsheetApp.getActiveSpreadsheet().getId());
  }

  /**
   * 設定を取得する。
   * @return {Array[Object]} 設定のリスト
   */
  constructor(ssId = getSettingsSsId()) {
    let ss;
    if (ssId) {
      ss = SpreadsheetApp.openById(ssId);
    } else {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
    const settingSheet = ss.getSheetByName(SETTINGS_SHEET_NAME);
    const values = settingSheet.getDataRange().getValues();
    this.settingData = values2object(values);
  }

  getAll() {
    return this.settingData;
  }

  get(name) {
    const setting = this.settingData.filter(elm => elm.name === name)[0];
    return setting;
  }
}

export default Settings;
