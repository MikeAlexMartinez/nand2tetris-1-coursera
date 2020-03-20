const path = require('path');
const fs = require('fs');
const parser = require('../Parser');
const binaryWriter = require('../Code')

async function main(file) {
  const filePath = path.resolve(file);
  const asmFile = await readFile(filePath);
  const fileParser = parser(binaryWriter);
  const hackFile = fileParser(asmFile);
  console.log(hackFile);
}

// read file
async function readFile(filePath) {
  try {
    const fileContents = await fs.readFileSync(filePath, { encoding: 'utf-8' });
    const asmFile = fileContents.split('\n');
    return asmFile;
  } catch (e) {
    console.log('error reading file');
    console.error(e);
  }
}

// return


// write file


module.exports = main;
