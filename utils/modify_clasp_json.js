const fs = require('fs');
const claspJson = require('../.clasp.json');

claspJson.rootDir = 'dest';
fs.writeFileSync('.clasp.json', JSON.stringify(claspJson));
