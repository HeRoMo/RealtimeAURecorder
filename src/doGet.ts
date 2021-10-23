import AppSettings, { Setting } from './AppSettings';
import Sheets from './Sheets';

const settings = new AppSettings();

/**
 * HtmlTemplateを継承し、属性を追加
 */
interface ExtendedHtmlTemplate extends GoogleAppsScript.HTML.HtmlTemplate {
  data: string;
  settings: Setting[];
  timezone: number;
}

/**
 * JSON.stringifyしたスプレッドシートからデータを取得する
 * @param name          [description]
 * @param yearMonthDate yyyy-MM-dd形式の年月日
 * @return JSON.stringifyしたスプレッドシートデータ
 */
function getDataJson(name: string, yearMonthDate: string): string {
  const setting = settings.get(name);
  const s = new Sheets(setting.base_dir);
  const { data, url } = s.getData(yearMonthDate);
  return JSON.stringify({
    name,
    ymd: yearMonthDate,
    data,
    url,
  });
}

/**
 * GETリクエストを処理する
 * @param  e [description]
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function doGet(e: any): GoogleAppsScript.HTML.HtmlOutput {
  const params = e.parameter;
  const { name, ymd } = params;

  let title = 'RealtimeAURecorder';

  let data = JSON.stringify({ name, ymd, data: [] });
  if (name && ymd) {
    data = getDataJson(name, ymd);
    title = `${name} [${ymd}] - ${title}`;
  }

  const template = HtmlService.createTemplateFromFile('index') as ExtendedHtmlTemplate;
  template.data = data;
  template.settings = settings.getAll();
  template.timezone = AppSettings.TIMEZONE;
  const htmloutput = template.evaluate();
  htmloutput.setTitle(title);
  return htmloutput;
}

/**
 * Select要素のOptionのために年のリストを取得する
 * @param  {String} name アプリケーション名
 * @return {Array[]}     {name, value} の配列
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getYears(name: string): Array<{name: number, value: string}> {
  const dataSheets = new Sheets(settings.get(name).base_dir);
  const years = dataSheets.getYears();
  return years.sort((a, b) => (b.name - a.name));
}

/**
 * Select要素のOptionのために年月のリストを取得する
 * @param name アプリケーション名
 * @param year 年
 * @return 年月のリスト。{name, value} の配列
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getYearMonths(name: string, year: string): Array<{name: number, value: string}> {
  const dataSheets = new Sheets(settings.get(name).base_dir);
  const months = dataSheets.getMonthsOf(Number(year));
  return months.sort((a, b) => (b.name - a.name));
}

/**
 * Select要素のOptionのために年月日のリストを取得する
 * @param name      アプリケーション名
 * @param yearMonth 年月
 * @return 年月日のリスト。{name, value} の配列
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getYearMonthDates(name: string, yearMonth: string): Array<{name: number, value: string}> {
  const dataSheets = new Sheets(settings.get(name).base_dir);
  const dates = dataSheets.getDatesOf(yearMonth);
  return dates.sort((a, b) => (b.name - a.name));
}
