'use strict';

const fs = require('node:fs');
const path = require('node:path');
const readline = require('readline'); 
const { stdin: input, stdout: output } = require('process');

console.log('Hello!');

fs.open(path.join(__dirname, 'newFile.txt'), 'a', (err) => {
  if(err) throw err;
});

console.log('File "newFile.txt" created in "02-write-file" folder. Now let\'s start typing. To quit press "ctrl + c" or write "exit" ');

const rl = readline.createInterface({ input, output });

rl.on('line', (input) => {
  if (input == 'exit') {
    console.log('Thank you');
    rl.close();
  } else {
    fs.appendFile(path.join(__dirname, 'newFile.txt'), `${input}\n`, (err) => {
      if(err) throw err;
    });
  }
});

rl.on('SIGINT', () => {
  console.log('Thank you');
  process.exit();
});
