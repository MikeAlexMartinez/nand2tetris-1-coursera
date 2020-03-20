const { floor, log2, pow } = Math;

function getStart(n) {
  return floor(log2(n) + 1);
}

function numToBinary(address) {
  let num = Number(address);
  if (num === 0) return '0';
  if (num < 0) throw new Error('address value must be greater than 0'); 

  const start = getStart(num);
  let val = pow(2, start - 1);
  let binaryString = '';
  while (val >= 1) {
    if (num >= val) {
      binaryString += '1';
    } else {
      binaryString += '0';
    }
    num -= val;
    val /= 2;
  }

  return binaryString
}

module.exports = numToBinary;
