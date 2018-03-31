import Settings from './settings';
import Sheets from './sheets';

function getData(name, yearMonthDate) {
  const setting = new Settings().get(name);
  const s = new Sheets(setting.base_dir);
  const sheet = s.getSheet(yearMonthDate);
  const range = sheet.getDataRange();
  const data = range.getValues();
  data.shift();
  return data.map(row => row.slice(0, 2));
}

function doGet(e) {
  const params = e.parameter;
  const name = params.name;
  const ymd = params.ymd;

  const settings = new Settings();
  const dataSheets = new Sheets(settings.get(name).base_dir);

  let data = [];
  if (name && ymd) {
    data = getData(name, ymd);
  }

  const years = dataSheets.getYears();
  const template = HtmlService.createTemplateFromFile('index');
  template.data = JSON.stringify(data);
  template.settings = settings.getAll();
  template.years = years;
  return template.evaluate();
}

global.doGet = doGet;
