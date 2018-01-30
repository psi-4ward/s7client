const {S7Server} = require('node-snap7');
const {datatypes} = require('../src/index');
const port = process.env.PORT || 9102;


const s7server = new S7Server();
s7server.SetResourceless(true);
s7server.SetParam(s7server.LocalPort, port);


s7server.on("readWrite", function(sender, operation, tagObj, buffer, callback) {
  console.log((operation === s7server.operationRead ? 'Read' : 'Write') + ' event from ' + sender);
  console.log('Area     : ' + tagObj.Area);
  console.log('DBNumber : ' + tagObj.DBNumber);
  console.log('Start    : ' + tagObj.Start);
  console.log('Size     : ' + tagObj.Size);
  console.log('WordLen  : ' + tagObj.WordLen);

  if(operation === s7server.operationRead) {
    buffer.fill(datatypes.CHAR.formatter('H'), 0);
    buffer.fill(datatypes.CHAR.formatter('I'), 1);
    buffer.fill(0b01000101, 2);
    buffer.fill(datatypes.INT.formatter(1337), 3);

    return callback(buffer);
  } else {
    console.log('Buffer   : ' + buffer.toString('ascii'));
    return callback();
  }
});


s7server.Start(function(errNum) {
  if(errNum) {
    console.error(s7server.ErrorText(errNum));
    process.exit(1);
  }
  console.log('Started snap7-server on Port', port);
});
