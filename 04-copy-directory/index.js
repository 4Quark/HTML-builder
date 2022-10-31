
'use strict';

const path = require('node:path');
const fs = require('fs');
const { readdir } = require('fs/promises');

let sourcePath = path.join(__dirname, 'files');
let targetPath = path.join(__dirname, 'files-copy');

function copyDir (sourcePath, targetPath) {

  fs.mkdir(targetPath, { recursive: true }, (err) => {
    if (err) throw err;
    (async function(targetPath) {
      try {
        const files = await readdir(targetPath);
        for (const file of files)
          await fs.unlink(path.join(targetPath, file), (err) => { if (err) throw err; } );
        (async function(sourcePath) {
          try {
            const files = await readdir(sourcePath, {withFileTypes: true});
            for (const file of files)
              if (file.isFile() == 1) {
                fs.copyFile(path.join(sourcePath, path.basename(`${file.name}`)), path.join(targetPath, path.basename(`${file.name}`)), err => {
                  if(err) throw err;
                  console.log(`File ${file.name} copied`);
                });
              }
          } catch (error) {
            console.error('there was an error:', error.message);
          }
        })(sourcePath);
      } catch (error) {
        console.error('there was an error:', error.message);
      }
    })(targetPath);
  });
}

copyDir (sourcePath, targetPath);
