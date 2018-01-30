# S7Client

Hi-Level API for [node-snap7](https://github.com/mathiask88/node-snap7) to communicate with Siemens S7 PCLs (See [compatibility](http://snap7.sourceforge.net/snap7_client.html#target_compatibility)).

* Promise based, `async/await` support
* Returns javascript objects with parsed var objects
* EventEmitter: (`connect`, `disconnect`, `connect_error`, `value`)
* Optional auto reconnect

** [API Documentation](https://psi-4ward.github.io/s7client) **

## Usage

```sh
npm install s7client
```

```js
const {S7Client} = require('s7client');

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
  { type: "CHAR", start: 0 },
  { type: "BOOL", start: 2, bit: 0 },
  { type: 'INT', start: 3 }
];

let client = new S7Client(plcSettings);
client.on('error', console.error);

(async function() {
  await client.connect();

  // Read DB
  const res = await client.readDB(dbNr, dbVars);
  console.log(res);

  // Write multiple Vars
  await client.writeVars([{
    area: 'db', dbnr: 1, type: 'BOOL',
    start: 5, bit: 2,
    value: true
  }]);

  client.disconnect();
})();
```


## Special thanks to
- Davide Nardella for creating [snap7](http://snap7.sourceforge.net)
- Mathias Küsel for creating [node-snap7](https://github.com/mathiask88/node-snap7)


## License & copyright
* [S7Client](https://github.com/psi-4ward/s7client/blob/master/LICENSE): MIT
* [node-snap7](https://github.com/mathiask88/node-snap7/blob/master/LICENSE): MIT
* [snap7](http://snap7.sourceforge.net/licensing.html): LGPLv3
