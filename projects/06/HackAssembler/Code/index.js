const { numToBinary } = require('../Utils');

const computeMap = {
  '0': '0101010',
  '1': '0111111',
  '-1': '0111010',
  'D': '0001100',
  'A': '0110000',
  '!D': '0001101',
  '!A': '0110001',
  '-D': '0001111',
  '-A': '0110011',
  'D+1': '0011111',
  'A+1': '0110111',
  'D-1': '0001110',
  'A-1': '0110010',
  'D+A': '0000010',
  'D-A': '0010011',
  'A-D': '0000111',
  'D&A': '0000000',
  'D|A': '0010101',
  'M': '1110000',
  '!M': '1110001',
  '-M': '1110011',
  'M+1': '1110111',
  'M-1': '1110010',
  'D+M': '1000010',
  'D-M': '1010011',
  'M-D': '1000111',
  'D&M': '1000000',
  'D|M': '1010101',
}

function getComputeBits(key) {
  return computeMap[key];
}

const jumpMap = {
  '0': '000',
  'JGT': '001',
  'JEQ': '010',
  'JGE': '011',
  'JLT': '100',
  'JNE': '101',
  'JLE': '110',
  'JMP': '111',
}

function getJumpBits(key) {
  return jumpMap[key];
}

function getDestBits(key) {
  const a = /A/.test(key) ? '1' : '0';
  const d = /D/.test(key) ? '1' : '0';
  const m = /M/.test(key) ? '1' : '0';

  return a + d + m;
}

function constructCInstruction(parsedInstruction) {
  const { elements: { compute, dest, jump }} = parsedInstruction;
  const computeBits = getComputeBits(compute);
  const destBits = getDestBits(dest);
  const jumpBits = getJumpBits(jump);
  return `111${computeBits}${destBits}${jumpBits}`;
}

function constructAInstruction(parsedInstruction) {
  const { elements: { address }} = parsedInstruction;
  return `0${numToBinary(address)}`;
}

function binaryWriter(parsedInstruction) {
  const { type } = parsedInstruction
  const binaryInstruction = type === 'A'
    ? constructAInstruction(parsedInstruction)
    : constructCInstruction(parsedInstruction)
  return `${binaryInstruction}\n`
}

module.exports = binaryWriter
