const snap7 = require('node-snap7').S7Client();
/**
 * S7Client Datatype
 *
 * @typedef {object} S7ClientDatatype
 * @property {number} bytes - Number of bytes
 * @property {function} parser - Convert Buffer to {bool|number|string}
 * @property {function} formatter - Convert {bool|number|string} to Buffer
 * @property {number} S7WordLen - S7WL type
 */

function _gen(bytes, bFn, S7WordLen) {
  return {
    bytes,
    parser: (buffer, offset = 0) => buffer['read'+bFn](offset),
    formatter: v => {
      const b = Buffer.alloc(bytes);
      b['write'+bFn](v);
      return b;
    },
    S7WordLen
  }
}

/**
 * @enum
 */
const Datatypes = {
  /**
   * BOOL
   * @type {S7ClientDatatype}
   */
  BOOL: {
    bytes: 1,
    parser: (buffer, offset = 0, bit = 0) => +buffer.readUInt8(offset) >> bit & 1 === 1,
    formatter: v => Buffer.from([v ? 0x01 : 0x00]),
    S7WordLen: snap7.S7WLBit
  },

  /**
   * BYTE
   * @type {S7ClientDatatype}
   */
  BYTE: _gen(1, 'UInt8', snap7.S7WLByte),

  /**
   * WORD
   * @type {S7ClientDatatype}
   */
  WORD: _gen(2, 'UInt16BE', snap7.S7WLByte),

  /**
   * DWORD
   * @type {S7ClientDatatype}
   */
  DWORD: _gen(4, 'UInt32BE', snap7.S7WLByte),

  /**
   * CHAR
   * @type {S7ClientDatatype}
   */
  CHAR: {
    bytes: 1,
    parser: (buffer, offset = 0) => buffer.toString('ascii', offset, offset + 1),
    formatter: v => Buffer.from(v, 'ascii'),
    S7WordLen: snap7.S7WLByte
  },
  
  /**
   * STRING16
   * @type {S7ClientDatatype}
   */
   STRING16: { // type to read an entire String[16] from PLC
    bytes: 18,
    parser: (buffer, offset = 0) => buffer.toString('ascii', offset + 2, buffer.readUInt8(1) + 2),
    formatter: v => Buffer.concat([
        Buffer.from([16, v.length <= 16 ? v.length : 16]),// maximum size | string size
        Buffer.from(v.length <= 15 ? v : v.substring(0, 16), 'ascii'), // string to buffer
        Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // fill zeros
      ]).subarray(0, 18),
    S7WordLen: snap7.S7WLByte
  },

  
  /**
   * STRING15
   * @type {S7ClientDatatype}
   */
   STRING15: { // type to read an entire String[15] from PLC
    bytes: 18,
    parser: (buffer, offset = 0) => buffer.toString('ascii', offset + 2, buffer.readUInt8(1) + 2),
    formatter: v => Buffer.concat([
        Buffer.from([15, v.length <= 15 ? v.length : 15]),// maximum size | string size
        Buffer.from(v.length <= 15 ? v : v.substring(0, 15), 'ascii'), // string to buffer
        Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // fill zeros
      ]).subarray(0, 18),
    S7WordLen: snap7.S7WLByte
  },
  
  
  /**
   * STRING20
   * @type {S7ClientDatatype}
   */
   STRING20: { // type to read an entire String[20] from PLC
    bytes: 22,
    parser: (buffer, offset = 0) => buffer.toString('ascii', offset + 2, buffer.readUInt8(1) + 2),
    formatter: v => Buffer.concat([
        Buffer.from([20, v.length <= 20 ? v.length : 20]),// maximum size | string size
        Buffer.from(v.length <= 20 ? v : v.substring(0, 20), 'ascii'), // string to buffer
        Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // fill zeros
      ]).subarray(0, 22),
    S7WordLen: snap7.S7WLByte
  },
  /**
   * INT
   * @type {S7ClientDatatype}
   */
  INT: _gen(2, 'Int16BE', snap7.S7WLByte),

  /**
   * DINT
   * @type {S7ClientDatatype}
   */
  DINT: _gen(4, 'Int32BE', snap7.S7WLByte),

  /**
   * REAL
   * @type {S7ClientDatatype}
   */
  REAL: _gen(4, 'FloatBE', snap7.S7WLByte),
};

module.exports = Datatypes;
