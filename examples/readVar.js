const {S7Client} = require('../src/index');

// PLC Connection Settings
const plcSettings = {
  name: "MyPLC",
  host: '127.0.0.1',
  port: 9102,
  rack: 0,
  slot: 2
};


let client = new S7Client(plcSettings);
client.on('error', console.error);

(async function() {
  const cpuInfo = await client.connect();
  console.log(cpuInfo);
  console.log("\n");

  console.time('readVar duration');
  const res = await client.readVar({
    type: 'CHAR',
    start: 1,
    area: 'db',
    dbnr: 1
  });
  console.log(res);
  console.timeEnd('readVar duration');

  client.disconnect();
})();
