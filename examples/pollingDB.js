const { S7Client } = require("s7client");

// PLC Connection Settings
const plcSettings = {
  name: "LocalPLC",
  host: 'localhost',
  port: 102,
  rack: 0,
  slot: 2
};

// DBA to read
let dbNr = 1;
let dbVars = [
  { ident: 'BOOL Bit 0', type: 'BOOL', start: 1, bit: 0 }
];

// plc connect
let client = new S7Client(plcSettings);
client.on('error', console.error);

// poll the PLC
(async function () {
  const plc = await client.connect();
  console.log('Connected!');

  const pollPLC = async () => {
    if (client.isConnected()) {
      const plcResult = await client.readDB(dbNr, dbVars);
      console.log(plcResult);
      console.log("\n");
      setTimeout(pollPLC, 60000); // 1min
    } else {
      console.error('Read Error')
    }
  }
  setTimeout(pollPLC, 1000); // 1sec
})();
