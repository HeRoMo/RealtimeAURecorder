
export interface Setting {
  name: string;
  ga_view_id: string;
  base_dir: string;
}

/**
 * Setting のType Guard関数
 * @param value
 */
function isSetting(value: object): value is Setting {
  return value['name'] && value['ga_view_id'] && value['base_dir'];
}
/**
 * Range#getValues で取得した2次元配列をオブジェクトの配列に変換する。
 * ただし、1行目はヘッダ行であることを前提としている
 * @param values データを含む2次元配列
 * @return JSONに変換した配列
 */
function values2object(values: object[][]): Setting[] {
  const keys: string[] = values.shift().map((val) => String(val));

  return values.map((row: object[]) => {
    const obj = {};
    row.forEach((val: object, index: number) => {
      obj[keys[index]] = val;
    });
    if(isSetting(obj)) return obj;
  });
}

class Settings {
  static readonly TIMEZONE = 9;
  static readonly SETTINGS_SHEET_NAME = 'SETTINGS';
  static readonly PROP_KEY_SSID = 'settingsSsId';

  private settingData: Setting[];
  private ss: GoogleAppsScript.Spreadsheet.Spreadsheet;
  /**
   * セットアップメソッド
   * 設定ファイルからスクリプトエディタを開き、一度実行すると、スクリプトプロパティに
   * 設定ファイルのIDを保存する。
   */
  static setUp(): void {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty(Settings.PROP_KEY_SSID, SpreadsheetApp.getActiveSpreadsheet().getId());
  }

  /**
   * 設定を取得する。
   * @return 設定のリスト
   */
  constructor(ssId = Settings.getSettingsSsId()) {
    if (ssId) {
      this.ss = SpreadsheetApp.openById(ssId);
    } else {
      this.ss = SpreadsheetApp.getActiveSpreadsheet();
    }
  }

  /**
   * 全設定データを取得する
   * @return Settingの配列
   */
  getAll(): Setting[] {
    if (!this.settingData) {
      const settingSheet = this.ss.getSheetByName(Settings.SETTINGS_SHEET_NAME);
      const values = settingSheet.getDataRange().getValues();
      this.settingData = values2object(values);
    }
    return this.settingData;
  }

  /**
   * 指定した名前に対応するデータを取得する
   * @param name アプリケーション名
   * @return
   */
  get(name: string): Setting {
    const setting = this.getAll().filter(elm => elm.name === name)[0];
    return setting;
  }

  /**
   * ScriptPropertyに保存されたコンテナドキュメントのIDを取得する。
   * @return コンテナドキュメントのID
   */
  static getSettingsSsId(): string {
    const scriptProperties = PropertiesService.getScriptProperties();
    return scriptProperties.getProperty(Settings.PROP_KEY_SSID);
  }
}

export default Settings;
