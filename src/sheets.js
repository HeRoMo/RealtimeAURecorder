// 日付の切り替わり時間。午前4時にシートを切り替える。
const DATE_CHANGE_HOUR = 4;

/**
 * Google Drive上のSpreadSheetに書き込むためのクラス。
 * 出力するデータの タイムスタンプに対応して、次の場所にファイルを出力する
 * baseDir/yyyy/yyyy-mm
 * このファイルには 日次で yyyy-mm-dd という名のシートを追加する。
 */
class Sheets {
  /**
   * コンストラクタ
   * @param {String} baseDirId 結果を出力するGoogle DriveのフォルダーID
   * @param {Integer} [dateChangeHour=DATE_CHANGE_HOUR] 日替わり時間
   */
  constructor(baseDirId, dateChangeHour = DATE_CHANGE_HOUR) {
    this.baseDirId = baseDirId;
    this.dateChangeHour = dateChangeHour;
    this.baseDir = DriveApp.getFolderById(this.baseDirId);
  }

  /**
   * year に対応した名称のフォルダを取得する。なければ作る。
   * @param  {Date}   [year=new Date().getYear()] [description]
   * @return {Folder} 取得、あるいは生成したフォルダ
   */
  getYearDir(year = new Date().getYear()) {
    const dirs = this.baseDir.getFoldersByName(year);
    const yearDir = dirs.hasNext() ? dirs.next() : this.baseDir.createFolder(year);
    return yearDir;
  }

  /**
   * yearMonth に対応した名称のスプレッドシートを取得する。なければ作る。
   * @param  {String} yearMonth yyyy-mm 形式の文字列
   * @return {SpreadSheet} 取得、あるいは生成したSpreadSheetオブジェクト
   */
  getSpreadSheetFile(yearMonth) {
    const year = yearMonth.split('-')[0];
    const yearDir = this.getYearDir(year);
    let ssFile;
    const files = yearDir.getFilesByName(yearMonth);
    if (files.hasNext()) {
      ssFile = SpreadsheetApp.open(files.next());
    } else {
      ssFile = SpreadsheetApp.create(yearMonth);
      const ssId = ssFile.getId();
      const tmpFile = DriveApp.getFileById(ssId);
      yearDir.addFile(tmpFile);
      DriveApp.getRootFolder().removeFile(tmpFile);
    }
    return ssFile;
  }

  /**
   * yearMonthDateに対応した名称のシートを取得する。なければ作る。
   * @param  {String} yearMonthDate yyyy-mm-dd 形式の文字列。
   * @return {Sheet}  取得、もしくは作成したSheetオブジェクト
   */
  getSheet(yearMonthDate) {
    if (!/([\d]{4}-[\d]{2})-[\d]{2}/.exec(yearMonthDate)) {
      throw new Error('yearMonthDate must be yyyy-mm-dd fomrmat');
    }
    const yearMonth = RegExp.$1;
    const ss = this.getSpreadSheetFile(yearMonth);
    let sheet = ss.getSheetByName(yearMonthDate);
    if (!sheet) {
      sheet = ss.insertSheet(yearMonthDate, 0);
      const headers = ['日時', 'アクティブユーザ数', 'STATUS'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      const firstColumn = headers.length + 1;
      sheet.deleteColumns(firstColumn, 26 - headers.length);
    }
    return sheet;
  }

  /**
   * データを追加する。
   * 追加先は data.datetimeの日付部分（yyyy-mm-dd）に対応するシートの末尾。
   * 日替わりの時間は DATE_CHANGE_HOUR で指定する。
   * @param  {Object} data {datatime, activeUsers, status}
   */
  appendData(data) {
    const dateInt = Date.parse(data.datetime.replace(' ', 'T'));
    if (!dateInt) throw new Error('Invalid datetime');
    const date = new Date(dateInt);
    date.setHours(date.getHours() - DATE_CHANGE_HOUR); // 日替わり時間分ずらす
    const yearMonthDate = Utilities.formatDate(date, 'JST', 'yyyy-MM-dd');
    const sheet = this.getSheet(yearMonthDate);
    sheet.appendRow([data.datetime, data.activeUsers, data.status]);
  }
}

export default Sheets;
