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
    start: 5,
    area: 'db',
    dbnr: 1,
    value: 'I'
  }
];


let client = new S7Client(plcSettings);
client.on('error', console.error);

client.connect()
  .then(cpuinfo => {
    console.log('Connection successful');
    // console.log(cpuinfo);
    console.time('MultiWrite');

    return client.writeVars(vars);
  })
  .then(res => {
    console.timeEnd('MultiWrite');
    res.forEach(v => console.log(v.value.toString(16)));
  })
  .then(() => client.disconnect())
  .catch(console.error);

