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

// function to start polling DB valus
let pollTimeout;
async function pollDB() {
  try {
    const plcResult = await client.readDB(dbNr, dbVars);
    console.log(plcResult, "\n");
  } catch (err) {
    console.error('Error readDB:', err, 'retry in 10s');
  }
  pollTimeout = setTimeout(pollDB, 10 * 1000);
}

// function to stop polling
function stopPollDB() {
  clearTimeout(pollTimeout);
}

// Setup S7Client
let client = new S7Client(plcSettings);
client.on('connect', () => console.log('Connected to PLC'));
client.on('connect', pollDB);
client.on('disconnect', () => consol.log('Disconnected from PLC'));
client.on('disconnect', stopPollDB);
client.on('error', err => console.error('PLC Error', err));

// Connect
(async function () {
  try {
    // auto reconnect
    await client.autoConnect();
  } catch (e) {
    // error event should log the problem
  }
})();
