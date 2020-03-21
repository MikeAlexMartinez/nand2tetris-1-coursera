const numToBinary = require('../numToBinary');

describe('numToBinary()', () => {
  const MAX_NUMBER = Math.pow(2, 15) - 1;
  
  describe('base cases', () => {
    let res;

    beforeEach(() => {
      res = numToBinary('8');
    });

    it('should return a string', () => {
      expect(typeof res).toBe('string');
    });
    it('should return a string with 15 characters', () => {
      expect(res.length).toBe(15);
    });
    it('should convert 8 to binary correctly', () => {
      expect(res).toBe('000000000001000');
    });
  })

  describe('edge cases', () => {
    it('should convert 5 to binary correctly', () => {
      expect(numToBinary('5')).toEqual('000000000000101');
    });
    it('should represent negative numbers in two\'s complement', () => {
      expect(numToBinary('-10')).toEqual('111111111110110');
    });
    it('should truncate numbers who exceed 15 characters', () => {
      const number = `${MAX_NUMBER+1}`;
      expect(numToBinary(number)).toEqual('000000000000000');
    });
  })
});
