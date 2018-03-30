import getSettings from './settings';
import Sheets from './sheets';

function getBaseDirId(name) {
  const settings = getSettings(getSettingsSsId());
  const setting = settings.filter(elm => elm.name === name)[0];
  return setting.base_dir;
}

function getData(name, yearMonthDate) {
  const s = new Sheets(getBaseDirId(name));
  const sheet = s.getSheet(yearMonthDate);
  const range = sheet.getDataRange();
  const data = range.getValues();
  data.shift();
  return data.map(row => row.slice(0, 2));
}

function doGet(e) {
  const params = e.parameter;

  if (params.name) {
    Logger.log(params.name);
  }

  const data = getData('Qiita', '2018-03-28');
  const template = HtmlService.createTemplateFromFile('index');
  template.data = JSON.stringify(data);
  template.settings = getSettings(getSettingsSsId());
  return template.evaluate();
}

global.doGet = doGet;
