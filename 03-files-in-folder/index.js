'use strict';

const fs = require('fs/promises');
const path = require('node:path');
const { readdir } = require('fs/promises');

(async function(folderPath) {
  try {
    const files = await readdir(folderPath, {withFileTypes: true});
    for (const file of files)
      if (file.isFile() == 1) {
        let stats = await fs.stat(path.join(__dirname, 'secret-folder', path.basename(`${file.name}`)));
        let nameOfFile = `${path.basename(`${file.name}`, path.extname(`${file.name}`))}`;
        let extantionOfFile = `${path.extname(`${file.name}`)}`;
        console.log(`${nameOfFile} - ${extantionOfFile.slice(1)} - ${stats.size / 1000} kb`);
      }
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})(path.join(__dirname, 'secret-folder'));
