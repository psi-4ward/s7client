const {S7Client} = require('../src/index');

// PLC Connection Settings
const plcSettings = {
  name: "LocalPLC",
  host: 'localhost',
  port: 9102,
  rack: 0,
  slot: 2
};

// DBA to read
let dbNr = 1;
let dbVars = [
  {
    ident: "Char",
    type: "CHAR",
    start: 0
  },
  {
    ident: "Char",
    type: "CHAR",
    start: 1
  },
  {
    ident: "BOOL Bit 0",
    type: "BOOL",
    start: 2,
    bit: 0
  },
  {
    ident: "BOOL Bit 6",
    type: "BOOL",
    start: 2,
    bit: 6
  },
  {
    ident: "Int",
    type: 'INT',
    start: 3
  },
];


let client = new S7Client(plcSettings);
client.on('error', console.error);

(async function() {
  const cpuInfo = await client.connect();
  console.log(cpuInfo);
  console.log("\n");

  console.time('ReadDB duration');
  const res = await client.readDB(dbNr, dbVars);
  res.forEach(v => console.log(`${v.ident}: ${v.value}`));
  console.timeEnd('ReadDB duration');

  client.disconnect();
})();
