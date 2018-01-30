const {S7Client, Datatypes} = require('../src');
const {S7Server} = require('node-snap7');
const chai = require('chai');
const expect = chai.expect;

describe('S7Client tests', function() {
  // create S7Server
  const s7server = new S7Server();
  // s7server.on("event", event => console.log(s7server.EventText(event)));

  before('Start soft PLC server', () => {
    return new Promise((resolve, reject) => {
      s7server.SetParam(s7server.LocalPort, process.env.PORT || 9102);
      s7server.RegisterArea(s7server.srvAreaDB, 1, Buffer.alloc(100, 0x00));
      s7server.StartTo('127.0.0.1', function(errNum) {
        if(errNum) return reject(s7server.ErrorText(errNum));
        resolve();
      });
    });
  });

  after('Disconnect client', () => client.disconnect());

  // stop S7Server after tests
  after('Stop soft PLC server', () => {
    return new Promise((resolve, reject) => {
      s7server.Stop(err => err ? reject(err) : resolve());
    });
  });

  let client = new S7Client({
    name: "Local SoftPLC",
    host: "127.0.0.1",
    port: process.env.PORT || 9102
  });

  describe('Module', () => {
    it('should export S7Client', () => expect(S7Client).to.be.not.undefined);
    it('should export Datatypes', () => expect(Datatypes).to.be.not.undefined);
  });

  describe('Constructor', () => {
    it('should create a s7client instance', () => expect(client).to.be.an.instanceof(S7Client));
  });

  describe('Connect', async () => {
    it('should return with CPUInfo object', async () => expect(await client.connect()).to.be.an('object'));
  });

  describe('writeVar', async () => {
    it('should resolve with an object', async () => expect(await client.writeVar({
      area: 'db', type: 'CHAR', dbnr: 1, start: 1, value: 'H'
    })).to.be.an('object'));
  });

  describe('writeVars', async () => {
    it('should resolve with an array', async () => expect(await client.writeVars([
      {area: 'db', type: 'CHAR', dbnr: 1, start: 2, value: 'E'},
      {area: 'db', type: 'CHAR', dbnr: 1, start: 3, value: 'L'},
      {area: 'db', type: 'CHAR', dbnr: 1, start: 4, value: 'L'},
      {area: 'db', type: 'CHAR', dbnr: 1, start: 5, value: 'O'},
    ])).to.be.an('array'));
  });

  describe('readDB', async () => {
    it('should return previous written HELLO', async () => {
      const res = await client.readDB(1, [
        {type: 'CHAR', start: 1},
        {type: 'CHAR', start: 2},
        {type: 'CHAR', start: 3},
        {type: 'CHAR', start: 4},
        {type: 'CHAR', start: 5},
      ]);
      expect(res).to.be.an('array');
      expect(res.reduce((s, item) => s+item.value, '')).to.be.equal('HELLO');
    });
  });

  describe('readVar', async () => {
    it('should return previous written E', async () => {
      const res = await client.readVar({type: 'CHAR', start: 2, area: 'db', dbnr: 1});
      expect(res).to.be.an('object');
      expect(res.value).to.be.equal('E');
    });
  });

  describe('readVars', async () => {
    it('should return previous written EL', async () => {
      const res = await client.readVars([
        {type: 'CHAR', start: 2, area: 'db', dbnr: 1},
        {type: 'CHAR', start: 3, area: 'db', dbnr: 1},
      ]);
      expect(res).to.be.an('array');
      expect(res.reduce((s, item) => s + item.value, '')).to.be.equal('EL');
    });
  });

  describe('dnsLookup', async () => {
    it('should be a static function', () => expect(S7Client.dnsLookup).to.be.a('function'));
    it('should resolve an ip', async () => expect(await S7Client.dnsLookup('localhost')).to.be.a('string'));
  });

  describe('isConnected', () => {
    it('should return the connection state', () => expect(client.isConnected()).to.be.a('boolean'));
  });

  describe('getCpuInfo', async () => {
    it('should return an object', async () => expect(await client.getCpuInfo()).to.be.a('object'));
  });

  describe('getPlcDateTime', async () => {
    it('should return an Date instance', async () => {
      expect(await client.getPlcDateTime()).to.be.instanceOf(Date)
    });
  });

  describe('autoconnect', async () => {
    it('should return with CPUInfo object', async () => expect(await client.autoConnect()).to.be.an('object'));
  });

  describe('_setupAliveCheck', async () => {
    it('should be called and setup _aliveCheckInterval', () => {
      expect(client._aliveCheckInterval).to.be.not.an('undefined');
    });
  });


});