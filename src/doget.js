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

  const settings = new Settings();

  if (params.name) {
    Logger.log(params.name);
  }

  const data = getData('Qiita', '2018-03-28');
  const template = HtmlService.createTemplateFromFile('index');
  template.data = JSON.stringify(data);
  template.settings = settings;
  return template.evaluate();
}

global.doGet = doGet;
