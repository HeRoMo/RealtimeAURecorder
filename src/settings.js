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

/**
 * 設定を取得する。
 * @return {Array[Object]} 設定のリスト
 */
function getSettings(ssId) {
  let ss;
  if (ssId) {
    ss = SpreadsheetApp.openById(ssId);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  const settingSheet = ss.getSheetByName(SETTINGS_SHEET_NAME);
  const values = settingSheet.getDataRange().getValues();
  const data = values2object(values);
  return data;
}

export default getSettings;
