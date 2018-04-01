import Settings from './settings';
import Sheets from './sheets';

const settings = new Settings();

/**
 * JSON.stringifyしたスプレッドシートからデータを取得する
 * @param  {String} name          [description]
 * @param  {String} yearMonthDate yyyy-MM-dd形式の年月日
 * @return {Object}               {name,ymd,data,url}
 */
function getDataJson(name, yearMonthDate) {
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
 * @param  {[type]} e [description]
 */
function doGet(e) {
  const params = e.parameter;
  const { name, ymd } = params;

  let title = 'RealtimeAURecorder';

  let data = { name, ymd, data: [] };
  if (name && ymd) {
    data = getDataJson(name, ymd);
    title = `${name} [${ymd}] - ${title}`;
  }

  const template = HtmlService.createTemplateFromFile('index');
  template.data = data;
  template.settings = settings.getAll();
  template.timezone = Settings.TIMEZONE;
  const htmloutput = template.evaluate();
  htmloutput.setTitle(title);
  return htmloutput;
}

/**
 * Select要素のOptionのために年のリストを取得する
 * @param  {String} name アプリケーション名
 * @return {Array[]}     {name, value} の配列
 */
function getYears(name) {
  const dataSheets = new Sheets(settings.get(name).base_dir);
  const years = dataSheets.getYears();
  return years.sort((a, b) => (b.name - a.name));
}

/**
 * Select要素のOptionのために年月のリストを取得する
 * @param  {String} name アプリケーション名
 * @param  {String} year 年
 * @return {Array[]}     {name, value} の配列
 */
function getYearMonths(name, year) {
  const dataSheets = new Sheets(settings.get(name).base_dir);
  const months = dataSheets.getMonthsOf(year);
  return months.sort((a, b) => (b.name - a.name));
}

/**
 * Select要素のOptionのために年月日のリストを取得する
 * @param  {String} name      アプリケーション名
 * @param  {String} yearMonth 年月
 * @return {Array[]}     {name, value} の配列
 */
function getYearMonthDates(name, yearMonth) {
  const dataSheets = new Sheets(settings.get(name).base_dir);
  const dates = dataSheets.getDatesOf(yearMonth);
  return dates.sort((a, b) => (b.name - a.name));
}

global.doGet = doGet;
global.getYears = getYears;
global.getYearMonths = getYearMonths;
global.getYearMonthDates = getYearMonthDates;
global.getDataJson = getDataJson;
