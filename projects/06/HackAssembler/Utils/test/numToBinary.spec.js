const numToBinary = require('../numToBinary');

describe('numToBinary()', () => {
  it('should convert 8 to binary correctly', () => {
    expect(numToBinary(8)).toEqual('1000');
  })
  it('should convert 5 to binary correctly', () => {
    expect(numToBinary(5)).toEqual('101');
  })
});
