/*
 * This script will be probably unnecessary in clasp v1.5.4 or lator
 */
const fs = require('fs');
const claspJson = require('../.clasp.json');

claspJson.rootDir = 'src';
fs.writeFileSync('.clasp.json', JSON.stringify(claspJson));
