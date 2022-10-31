'use strict';

const path = require('node:path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const BUNDLE_PATH = path.join(__dirname, 'project-dist', 'bundle.css');

fs.open(BUNDLE_PATH, 'a', (err) => {
  if(err) {
    throw err;
  } else {
    fs.truncate(BUNDLE_PATH, (err) => {
      if(err) throw err;
    });
  }
});

(async function(folderPath) {
  try {
    const files = await readdir(folderPath);
    for (const file of files)
      if (path.extname(`${file}`) == '.css') {
        const rr = fs.createReadStream(path.join(folderPath, file));
        rr.on('data', (chunk) => { 
          fs.appendFile(BUNDLE_PATH, chunk, (err) => {
            if(err) throw err;
          });
        });
        console.log(`${file} added to bundle.css`);
        fs.appendFile(BUNDLE_PATH, '\n\n', (err) => {if(err) throw err;});
      }
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})(path.join(__dirname, 'styles'));
