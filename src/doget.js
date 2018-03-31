import Settings from './settings';
import Sheets from './sheets';

const settings = new Settings();

function getData(name, yearMonthDate) {
  const setting = settings.get(name);
  const s = new Sheets(setting.base_dir);
  const sheet = s.getSheet(yearMonthDate);
  const range = sheet.getDataRange();
  const data = range.getValues();
  data.shift();
  const result = data.map(row => row.slice(0, 2));
  return result;
}

function getDataJson(name, yearMonthDate) {
  const data = getData(name, yearMonthDate);
  return JSON.stringify({ name, ymd: yearMonthDate, data });
}

function doGet(e) {
  const params = e.parameter;
  const name = params.name;
  const ymd = params.ymd;

  let data = { name, ymd, data: [] };
  if (name && ymd) {
    data = getDataJson(name, ymd);
  }

  let years = [];
  if (name) {
    const dataSheets = new Sheets(settings.get(name).base_dir);
    years = dataSheets.getYears();
  }

  const template = HtmlService.createTemplateFromFile('index');
  template.data = data;
  template.settings = settings.getAll();
  template.years = years;
  return template.evaluate();
}

function getYears(name) {
  const dataSheets = new Sheets(settings.get(name).base_dir);
  const years = dataSheets.getYears();
  return years.sort((a, b) => (b.name - a.name));
}

function getYearMonths(name, year) {
  const dataSheets = new Sheets(settings.get(name).base_dir);
  const months = dataSheets.getMonthsOf(year);
  return months.sort((a, b) => (b.name - a.name));
}

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
