const MAX_LENGTH = 15;
const NEGATIVE_MAX = Math.pow(2, MAX_LENGTH - 1);

function positiveNumToBinary(num) {
  return num.toString(2);
}

function createPaddingBits(binString) {
  const missingLength = MAX_LENGTH - binString.length;
  if (missingLength > 0) {
    const noughtArray = Array(missingLength);
    return noughtArray.fill('0').join('');
  }
  return binString;
}

function addPaddingBits(binString) {
  const paddingBits = createPaddingBits(binString);
  return paddingBits + binString;
}

function truncateExtraBits(binString) {
  return binString.substring(binString.length - MAX_LENGTH);
}

function setBitLength(binString) {
  return binString.length <= MAX_LENGTH
    ? addPaddingBits(binString)
    : truncateExtraBits(binString);
}

function numToBinary(address) {
  let num = Number(address)
  if (num < 0) {
    num += NEGATIVE_MAX;
    return `1${positiveNumToBinary(num)}`;
  } else {
    const binaryBits = positiveNumToBinary(num);
    return setBitLength(binaryBits);
  }
}

module.exports = numToBinary;
