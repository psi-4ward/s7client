const {Datatypes} = require('../src');
const chai = require('chai');
const expect = chai.expect;

describe('Datatype tests', function() {
  const propChecks = obj => {
    it('should have a bytes property', () => expect(obj.bytes).to.be.an('number'));
    it('should have a parser property', () => expect(obj.parser).to.be.an('function'));
    it('should have a formatter property', () => expect(obj.formatter).to.be.an('function'));
    it('should have a S7WordLen property', () => expect(obj.S7WordLen).to.be.an('number'));
  };
  const formatterCheck = (obj, input, output) => {
    it('formatter should create a valid Buffer', () => expect(obj.formatter(input)).to.be.deep.equal(output));
  };
  const parserCheck = (obj, input, output) => {
    it('parser should create a valid output', () => expect(obj.parser(input)).to.be.equal(output));
  };

  Object.keys(Datatypes).forEach(datatype => {
    describe(`${datatype} properties`, () => {
      const obj = Datatypes[datatype];
      propChecks(obj);
      switch(datatype) {
        case 'BOOL':
          formatterCheck(obj, 1, new Buffer([0x01]));
          formatterCheck(obj, 0, new Buffer([0x00]));
          parserCheck(obj, new Buffer([0x01]), 1);
          parserCheck(obj, new Buffer([0x00]), 0);
          break;
        case 'BYTE':
          formatterCheck(obj, 0xAF, new Buffer([0xAF]));
          parserCheck(obj, new Buffer([0xAF]), 0xAF);
          break;
        case 'WORD':
          formatterCheck(obj, 0xAFB0, new Buffer([0xAF,0xB0]));
          parserCheck(obj, new Buffer([0xAF, 0xB0]), 0xAFB0);
          break;
        case 'DWORD':
          formatterCheck(obj, 0xAFB0AFB0, new Buffer([0xAF, 0xB0, 0xAF, 0xB0]));
          parserCheck(obj, new Buffer([0xAF, 0xB0, 0xAF, 0xB0]), 0xAFB0AFB0);
          break;
        case 'CHAR':
          formatterCheck(obj, 'K', new Buffer('K', 'ascii'));
          parserCheck(obj, new Buffer('K', 'ascii'), 'K');
          break;
        case 'INT':
          const intBuff = new Buffer(2);
          intBuff.writeInt16BE(1337);
          formatterCheck(obj, 1337, intBuff);
          parserCheck(obj, intBuff, 1337);
          break;
        case 'DINT':
          const dintBuff = new Buffer(4);
          dintBuff.writeInt32BE(1337133713);
          formatterCheck(obj, 1337133713, dintBuff);
          parserCheck(obj, dintBuff, 1337133713);
          break;
        case 'REAL':
          formatterCheck(obj, 1337.1337, new Buffer([0x44, 0xA7, 0x24, 0x47]));
          it('parser should create a valid output', () => expect(obj.parser(new Buffer([0x44, 0xA7, 0x24, 0x47]))).to.be.closeTo(1337.1337, 0.0001));
          break;
      }
    });
  });
});
