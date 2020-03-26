const path = require('path');
const fs = require('fs');
const parser = require('../Parser');
const asmWriter = require('../CodeWriter')

async function main(file) {
  const filePath = path.resolve(file);
  const targetPath = filePath.replace(/\.vm$/, '.asm');
  const vmFile = await readFile(filePath);
  const fileParser = parser(asmWriter);
  const asmFile = fileParser(vmFile);
  await writefile(asmFile, targetPath);
}

// read file
async function readFile(filePath) {
  try {
    const fileContents = await fs.readFileSync(filePath, { encoding: 'utf8' });
    const vmFile = fileContents.split('\n');
    return vmFile;
  } catch (e) {
    console.log('error reading file');
    console.error(e);
  }
}

// write file
async function writefile(asmFile, target) {
  try {
    await fs.writeFileSync(target, asmFile.join('\n'), { encoding: 'utf8' });
  } catch (e) {
    console.log('error writing file');
    console.error(e);
    throw e;
  }
}

module.exports = main;