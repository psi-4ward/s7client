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
    formatter: v => new Buffer([v ? 0x01 : 0x00]),
    S7WordLen: snap7.S7WLBit
  },

  /**
   * BYTE
   * @type {S7ClientDatatype}
   */
  BYTE: {
    bytes: 1,
    parser: (buffer, offset = 0) => buffer.readUInt8(offset),
    formatter: v => {
      const b = new Buffer(1);
      b.writeUInt8(v);
      return b;
    },
    S7WordLen: snap7.S7WLByte
  },

  /**
   * WORD
   * @type {S7ClientDatatype}
   */
  WORD: {
    bytes: 2,
    parser: (buffer, offset = 0) => buffer.readUInt16BE(offset),
    formatter:
      v => {
        const b = new Buffer(2);
        b.writeUInt16BE(v);
        return b;
      },
    S7WordLen:
    snap7.S7WLWord
  },

  /**
   * DWORD
   * @type {S7ClientDatatype}
   */
  DWORD: {
    bytes: 4,
    parser: (buffer, offset = 0) => buffer.readUInt32BE(offset),
    formatter:
      v => {
        const b = new Buffer(4);
        b.writeUInt32BE(v);
        return b;
      },
    S7WordLen:
    snap7.S7WLWord
  },

  /**
   * CHAR
   * @type {S7ClientDatatype}
   */
  CHAR: {
    bytes: 1,
    parser: (buffer, offset = 0) => buffer.toString('ascii', offset, offset + 1),
    formatter: v => new Buffer(v, 'ascii'),
    S7WordLen:
    snap7.S7WLDWord
  },

  /**
   * INT
   * @type {S7ClientDatatype}
   */
  INT: {
    bytes: 2,
    parser: (buffer, offset = 0) => buffer.readInt16BE(offset),
    formatter:
      v => {
        const b = new Buffer(2);
        b.writeInt16BE(v);
        return b;
      },
    S7WordLen:
    snap7.S7WLWord
  },

  /**
   * DINT
   * @type {S7ClientDatatype}
   */
  DINT: {
    bytes: 4,
    parser: (buffer, offset = 0) => buffer.readInt32BE(offset),
    formatter:
      v => {
        const b = new Buffer(4);
        b.writeInt32BE(v);
        return b;
      },
    S7WordLen:
    snap7.S7WLDWord
  },

  /**
   * REAL
   * @type {S7ClientDatatype}
   */
  REAL: {
    bytes: 4,
    parser: (buffer, offset = 0) => buffer.readFloatBE(offset),
    formatter:
      v => {
        const b = new Buffer(4);
        b.writeFloatBE(v);
        return b;
      },
    S7WordLen:
    snap7.S7WLDWord
  }
};

module.exports = Datatypes;
