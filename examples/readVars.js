const {S7Client} = require('../src/index');

// PLC Connection Settings
const plcSettings = {
  name: "MyPLC",
  host: '127.0.0.1',
  port: 9102,
  rack: 0,
  slot: 2
};

// DBA to read
let vars = [
  {
    type: 'CHAR',
    start: 0,
    area: 'db',
    dbnr: 1
  },
  {
    type: 'CHAR',
    start: 1,
    area: 'db',
    dbnr: 1
  },
];


let client = new S7Client(plcSettings);
client.on('error', console.error);

(async function() {
  const cpuInfo = await client.connect();
  console.time('readVars duration');
  const res = await client.readVars(vars);
  res.forEach(v => console.log(`${v.value}`));
  console.timeEnd('readVars duration');

  client.disconnect();
})();

