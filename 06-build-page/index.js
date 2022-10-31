'use strict';

const path = require('node:path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const PROJECT_FOLDER = path.join(__dirname, 'project-dist');
const STYLE_PATH = path.join(__dirname, 'project-dist', 'style.css');
const ASSETS_SOURCE = path.join(__dirname, 'assets');
const ASSETS_TARGET = path.join(__dirname, 'project-dist', 'assets');
const INDEX_PATH = path.join(__dirname, 'project-dist', 'index.html');
const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const INDEX_COMPONENTS_PATH = path.join(__dirname, 'components');

// ______ создаем папку проекта ______

fs.mkdir(PROJECT_FOLDER, { recursive: true }, (err) => {
  if (err) throw err;
});

// ______ формируем index.html ______

fs.readFile(TEMPLATE_PATH, 'utf-8', (err, data) => {
  if (err) throw err;
  let innerIndex = data;
  fs.readdir(INDEX_COMPONENTS_PATH, (err, files) => {
    if (err) throw err;
    for (const file of files) 
      fs.readFile(path.join(INDEX_COMPONENTS_PATH, file), 'utf-8', (err, data) => {
        if (err) throw err;
        innerIndex = innerIndex.replace(`{{${file.slice(0, file.lastIndexOf('.'))}}}`, data);
        fs.writeFile(INDEX_PATH, innerIndex, () => {
          console.log(`${file} added`);
        });
      }
      );
  });
});

// ______ собираем стили ______

fs.open(STYLE_PATH, 'a', (err) => {
  if(err) { throw err; } 
  console.log('style.css created');
  fs.truncate(STYLE_PATH, (err) => {
    if(err) throw err;
  });
  (async function(folderPath) {
    try {
      const files = await readdir(folderPath);
      for (const file of files)
        if (path.extname(`${file}`) == '.css') {
          const rr = fs.createReadStream(path.join(folderPath, file));
          rr.on('data', (chunk) => { 
            fs.appendFile(STYLE_PATH, chunk, (err) => {
              if(err) throw err;
            });
          });
          console.log(`${file} added to style.css`);
          fs.appendFile(STYLE_PATH, '\n\n', (err) => {if(err) throw err;});
        }
    } catch (error) {
      console.error('there was an error:', error.message);
    }
  })(path.join(__dirname, 'styles'));
  
});

// ______ копируем assets ______

(function(sourcePath, targetPath) {

  fs.mkdir(targetPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  (async function(sourcePath) {
    try {
      const files = await readdir(sourcePath, {withFileTypes: true});
      for (const file of files)
        if (file.isFile() == 1) {
          fs.copyFile(path.join(sourcePath, path.basename(`${file.name}`)), path.join(targetPath, path.basename(`${file.name}`)), err => {
            if(err) throw err;
            console.log(` ${file.name} copied`);
          });
        } else {
          fs.mkdir(path.join(targetPath, path.basename(`${file.name}`)), { recursive: true }, (err) => {
            if (err) throw err;
          });
          const folderFiles = await readdir(path.join(sourcePath, path.basename(`${file.name}`)), {withFileTypes: true});
          for (const folderFile of folderFiles) {
            if (folderFile.isFile() == 1) {
              fs.copyFile(path.join(sourcePath, path.basename(`${file.name}`), path.basename(`${folderFile.name}`)), path.join(targetPath, path.basename(`${file.name}`), path.basename(`${folderFile.name}`)), err => {
                if(err) throw err;
                console.log(` ${folderFile.name} copied`);
              });
            }
          }
        }
    } catch (error) {
      console.error('there was an error:', error.message);
    }
  })(sourcePath);
})(ASSETS_SOURCE, ASSETS_TARGET);
