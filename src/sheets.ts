// 日付の切り替わり時間。午前4時にシートを切り替える。
const DATE_CHANGE_HOUR = 4;
const TIME_ZONE = 'JST';
const DATE_FORMAT = 'yyyy-MM-dd';
const Z_COLUMN_POSITION = 26;

/**
 * Google Drive上のSpreadSheetに書き込むためのクラス。
 * 出力するデータの タイムスタンプに対応して、次の場所にファイルを出力する
 * baseDir/yyyy/yyyy-mm
 * このファイルには 日次で yyyy-mm-dd という名のシートを追加する。
 */
class Sheets {
  private baseDirId: string;
  private baseDir: GoogleAppsScript.Drive.Folder;
  /**
   * コンストラクタ
   * @param baseDirId 結果を出力するGoogle DriveのフォルダーID
   * @param dateChangeHour 日替わり時間
   */
  constructor(baseDirId) {
    this.baseDirId = baseDirId;
    this.baseDir = DriveApp.getFolderById(this.baseDirId);
  }

  /**
   * 西暦の一覧を取得する
   * @return 西暦の一覧
   */
  getYears(): Array<{name: number, value: string }> {
    const folders = this.baseDir.getFolders();
    const years = [];
    while (folders.hasNext()) {
      const name = Number(folders.next().getName());
      years.push({ name, value: name });
    }
    return years;
  }

  /**
   * 指定された年の月の一覧を取得する
   * @param year 西暦
   * @return 月の一覧 {name, value}
   */
  getMonthsOf(year: number) {
    const yearDir = this.getYearDir(year);

    const folders = yearDir.getFilesByType(MimeType.GOOGLE_SHEETS);
    const yearMonths = [];
    while (folders.hasNext()) {
      const value = folders.next().getName();
      const month = value.split('-')[1];
      yearMonths.push({ name: month, value });
    }
    return yearMonths;
  }

  /**
   * 指定した年月の日のリストを取得する
   * @param yearMonth yyyy-MM 形式の年月
   * @return 年月の日のリスト
   */
  getDatesOf(yearMonth: string): Array<{name: number, value: string}> {
    const yearMonthFile = this.getSpreadSheetFile(yearMonth);
    const sheets = yearMonthFile.getSheets();
    let dates = sheets.map((sheet) => {
      const value = sheet.getName();
      const name = Number(value.split('-')[2]);
      const ret = /[\d]{4}-[\d]{2}-[\d]{2}/.test(value) ? { name, value } : null;
      return ret;
    });
    dates = dates.filter(value => !!value);
    return dates;
  }

  /**
   * year に対応した名称のフォルダを取得する。なければ作る。
   * @param year 西暦
   * @return 取得、あるいは生成したフォルダ
   */
  getYearDir(year: number = new Date().getFullYear()): GoogleAppsScript.Drive.Folder {
    const yearStr = String(year);
    const dirs = this.baseDir.getFoldersByName(yearStr);
    const yearDir = dirs.hasNext() ? dirs.next() : this.baseDir.createFolder(yearStr);
    return yearDir;
  }

  /**
   * yearMonth に対応した名称のスプレッドシートを取得する。なければ作る。
   * @param yearMonth yyyy-mm 形式の文字列
   * @return 取得、あるいは生成したSpreadSheetオブジェクト
   */
  getSpreadSheetFile(yearMonth: string): GoogleAppsScript.Spreadsheet.Spreadsheet {
    const year = Number(yearMonth.split('-')[0]);
    const yearDir = this.getYearDir(year);
    let ssFile: GoogleAppsScript.Spreadsheet.Spreadsheet;
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
   * @param yearMonthDate yyyy-mm-dd 形式の文字列。
   * @return 取得、もしくは作成したSheetオブジェクト
   */
  getSheet(yearMonthDate: string): GoogleAppsScript.Spreadsheet.Sheet {
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
      sheet.deleteColumns(firstColumn, Z_COLUMN_POSITION - headers.length);
    }
    return sheet;
  }

  /**
   * データを追加する。
   * 追加先は data.datetimeの日付部分（yyyy-mm-dd）に対応するシートの末尾。
   * 日替わりの時間は DATE_CHANGE_HOUR で指定する。
   * @param data {datatime, activeUsers, status}
   */
  appendData(data: {datetime: string, activeUsers: number, status:string}): void {
    const dateInt = Date.parse(data.datetime.replace(' ', 'T'));
    if (!dateInt) throw new Error('Invalid datetime');
    const date = new Date(dateInt);
    date.setHours(date.getHours() - DATE_CHANGE_HOUR); // 日替わり時間分ずらす
    const yearMonthDate = Utilities.formatDate(date, TIME_ZONE, DATE_FORMAT);
    const sheet = this.getSheet(yearMonthDate);
    sheet.appendRow([data.datetime, data.activeUsers, data.status]);
  }

  /**
   * 指定した年月日のデータを取得する。
   * ヘッダは削除されている。
   * @param yearMonthDate yyyy-MM-dd形式の年月日
   * @return データ [日次, アクティブユーザ数]
   */
  getData(yearMonthDate: string): { data: object[][], url: string } {
    const sheet = this.getSheet(yearMonthDate);
    const range = sheet.getDataRange();
    const data = range.getValues();
    data.shift();
    const refinedData = data.map(row => row.slice(0, 2));
    const url = `${sheet.getParent().getUrl()}#gid=${sheet.getSheetId()}`;
    return { data: refinedData, url };
  }
}

export default Sheets;
