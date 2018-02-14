# S7Client

[![npm](https://img.shields.io/npm/v/s7client.svg)](https://www.npmjs.com/package/s7client)
[![Dependencies](https://david-dm.org/psi-4ward/s7client.svg)](https://david-dm.org/psi-4ward/s7client)
[![Known Vulnerabilities](https://snyk.io/test/github/psi-4ward/s7client/badge.svg)](https://snyk.io/test/github/psi-4ward/s7client)
[![Greenkeeper badge](https://badges.greenkeeper.io/psi-4ward/s7client.svg)](https://greenkeeper.io/)
[![Maintainability](https://api.codeclimate.com/v1/badges/74afb63a0af08f701de3/maintainability)](https://codeclimate.com/github/psi-4ward/s7client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/74afb63a0af08f701de3/test_coverage)](https://codeclimate.com/github/psi-4ward/s7client/test_coverage)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RTWDCH74TJN54&item_name=s7client)


Hi-Level API for [node-snap7](https://github.com/mathiask88/node-snap7) to communicate with Siemens S7 PCLs (See [compatibility](http://snap7.sourceforge.net/snap7_client.html#target_compatibility)).

* Promise based, `async/await` support
* Returns javascript objects with parsed var objects
* EventEmitter: (`connect`, `disconnect`, `connect_error`, `value`)
* Optional auto reconnect

**[API Documentation](https://psi-4ward.github.io/s7client)**

[Blog post](https://psi.cx/2018/siemens-s7-web-hmi/) about my SIMATIC S7 Web HMI project.

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
