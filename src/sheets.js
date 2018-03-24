const DATE_CHANGE_HOUR = 4; // 日付の切り替わり時間。午前4時にシートを切り替える。

/*
書き込むファイルを取得するのが主な役割。
年ごとにYYYY 名のフォルダを作り、その中に月ごとのファイルをMMで作る。
各ファイルは日毎のシートを作る
 */

class Sheets {
  /**
   * [constructor description]
   * @param {[type]} baseDirId                       [description]
   * @param {[type]} [dateChangeHour=DATE_CHANGE_HOUR] [description]
   */
  constructor(baseDirId, dateChangeHour = DATE_CHANGE_HOUR) {
    this.baseDirId = baseDirId;
    this.dateChangeHour = dateChangeHour;
    this.baseDir = DriveApp.getFolderById(this.baseDirId);
  }

  /**
   * [getYearDir description]
   * @param  {Date}   [year=new Date().getYear()] [description]
   * @return {[type]}           [description]
   */
  getYearDir(year = new Date().getYear()) {
    const dirs = this.baseDir.getFoldersByName(year);
    const yearDir = dirs.hasNext() ? dirs.next() : this.baseDir.createFolder(year);
    return yearDir;
  }

  /**
   * [getSpreadSheetFile description]
   * @param  {[type]} yearMonth [description]
   * @return {[type]}           [description]
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
   * 日付に対応した名称のシートを取得する。なければ作る。
   * 日替わりの時間は DATE_CHANGE_HOUR で指定。
   */
  getSheet(yearMonthDate) {
    if (!/([\d]{4}-[\d]{2})-[\d]{2}/.exec(yearMonthDate)) {
      throw new Error('yearMonthDate must be yyyy-mm-dd fomrmat');
    }
    const yearMonth = RegExp.$1;
    const ss = this.getSpreadSheetFile(yearMonth);
    // const date = new Date();
    // date.setHours(date.getHours() - DATE_CHANGE_HOUR);
    // const sheetName = Utilities.formatDate(date, 'JST', "'au_'yyyyMMdd");
    let sheet = ss.getSheetByName(yearMonthDate);
    if (!sheet) {
      sheet = ss.insertSheet(yearMonthDate, 0);
      const headers = ['日時', 'アクティブユーザ数', 'STATUS'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      const firstColumn = headers.length + 1;
      const lastColumn = sheet.getLastColumn();
      sheet.deleteColumns(firstColumn, lastColumn - firstColumn);
    }
    return sheet;
  }

  /**
   * [appendData description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  appendData(data) {
    const yearMonthDate = data.datetime.split(' ')[0];
    const sheet = this.getSheet(yearMonthDate);
    sheet.appendRow([data.datetime, data.activeUsers, data.status]);
  }
}

export default Sheets;
