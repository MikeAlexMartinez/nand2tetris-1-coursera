const path = require('path');
const fs = require('fs');
const parser = require('../Parser');
const binaryWriter = require('../Code')

async function main(file) {
  const filePath = path.resolve(file);
  const targetPath = filePath.replace(/\.asm$/, '.hack');
  const asmFile = await readFile(filePath);
  const fileParser = parser(binaryWriter);
  const hackFile = fileParser(asmFile);
  await writefile(hackFile, targetPath);
}

// read file
async function readFile(filePath) {
  try {
    const fileContents = await fs.readFileSync(filePath, { encoding: 'utf8' });
    const asmFile = fileContents.split('\n');
    return asmFile;
  } catch (e) {
    console.log('error reading file');
    console.error(e);
  }
}

// write file
async function writefile(hackFile, target) {
  try {
    await fs.writeFileSync(target, hackFile.join('\n'), { encoding: 'utf8' });
  } catch (e) {
    console.log('error reading file');
    console.error(e);
    throw e;
  }
}

module.exports = main;
