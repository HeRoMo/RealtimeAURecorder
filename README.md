# RealtimeAURecorder

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

A Google Apps Script application to record realtime active users from Google Analytics.

This application has the following features,

- Recording the value of realtime active users
- Drawing line chart of recorded active users

## Dependencies

- Node.js 8.11 or later
- [google/clasp](https://github.com/google/clasp) 1.5.3 or later
- Google Sheets
- Google Analytics API

## How to install
1. Clone [RealtimeAURecorder](https://github.com/HeRoMo/RealtimeAURecorder). and install npm packages.

```
$ git clone https://github.com/HeRoMo/RealtimeAURecorder.git
$ cd RealtimeAURecorder
$ yarn install
```

2. Create project and deploy

```bash
$ yarn clasp:login
$ yarn clasp:create # create new GAS project named RealtimeAuRecorder
$ yarn clasp:push # deploy
```

**Notice:** this scripts uses `clasp` command. see [@google/clasp](https://github.com/google/clasp)

3. Open container spreadsheet, and open script editor, then run `setUp` function in _code.gs_.
   - function `setUp` creates SETTINGS sheet in container spreadsheet.
4. Turn **ON** _Google Analytics API_ in Advanced Google services setting of the script and API console of Google Cloud.

## How to setting

1. Create a folder as _base_dir_ in your Google Drive, that is for creating spreadsheets to record realtime active users count.
2. Open the SETTINGS sheet.
3. Add a row to SETTINGS sheet.
   - _name_ : your web site name
   - _ga_view_id_ : Google Analytics view id of your web site.
   - _base_dir_ : Google Drive folder id of your _base_dir_.
4. Test your setting.<br>
  Open script editor and exec `recordAUAll` function in _code.gs_.<br>
  if your setting is collect, a folder and a spreadsheet created in _base_dir_.
5. If you have another web site, add another row in the SETTINGS sheet.

![SETTINGS](doc/SETTINGS.png)

## Record continuously

To record active users, you only run `recordAUAll` function in _code.gs_.<br>
To record active users continuously, you can use time-driven trigger.

1. Run `yarn clasp:open` to open script editor.
2. From the script editor, choose **Edit > Current project's triggers**.
3. Click the link that says: **Click here to add one now**.
4. Under Run, select `recordAUAll` function.
5. Under Events, select **Time-driven**, and select **Minutes timer**, and then select **every 5 minutes**.

## Web interface

This application has web user interface, for showing the chart of active users count.

At first, you have to Deploy this scripts as a web app.

1. Open script editor from the container spreadsheet.
2. Select **Publish > Deploy as web app**.
3. Select _version_, _authorization_ and _access scope_.
4. Publish the web app.
5. Access your web app url.

## License

This scripts is released under the MIT License, see [LICENSE](./LICENSE.txt).
