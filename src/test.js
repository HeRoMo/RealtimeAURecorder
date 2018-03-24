function myFunction() {
  const date = new Date();
  date.setHours(date.getHours() + 10);
  date.setHours(date.getHours() - DATE_CHANGE_HOUR);
  Logger.log(date);
  const time = Utilities.formatDate(date, 'JST', "'au_'yyyyMMdd");
  Logger.log(time);
}

function addChart(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  const range = sheet.getRange('A1:B100');
  const chartBuilder = sheet.newChart();
  chartBuilder.addRange(range)
    .setChartType(Charts.ChartType.LINE)
    .setOption('title', 'My Line Chart!')
    .setPosition(1, 1, 0, 0);
  sheet.insertChart(chartBuilder.build());
}

function test() {
  addChart('activeUsers');
}
