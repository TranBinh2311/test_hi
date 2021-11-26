const app = require('./app');
const config = require('./config/config');
const serialPort = require('serialport');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const fs = require('fs');
const path = require('path');
const childProc = require('child_process');
const logger = require('./config/logger');
const homeController = require('./controllers/home.controller');

let serverHTTP;

serverHTTP = server.listen(config.port, async () => {
  logger.info(`Listening to port ${config.port}`);
  childProc.exec('chromium-browser --start-fullscreen http://localhost:3000/v1');
});

const exitHandler = () => {
  if (serverHTTP) {
    serverHTTP.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// childProc.exec('hromium-browser --start-fullscreen http://localhost:3000/v1', callback);
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (serverHTTP) {
    serverHTTP.close();
  }
});

// initialize serial connection with a single byte parser
// const serialConnection = new serialPort('COM1', {
//   parser: new serialPort.parsers.Readline({ delimiter: '\r\n' }),
//   baudRate: 115200
// });

// init with RPi
const serialConnection = new serialPort('/dev/ttyAMA0', {
  parser: new serialPort.parsers.Readline({ delimiter: '\r\n' }),
  baudRate: 115200,
});

let fullData = '';
let fullDataOld = '';
let stringValidate = false;

async function main(fullDataParams) {
  const data = fs.readFileSync(path.join(__dirname, 'controllers/device/list.device.json'), { encoding: 'utf8', flag: 'r' });
  const obj = JSON.parse(data);
  // const dataSplit = fullDataParams.split(',');
  // obj.some((element) => console.log(element.deviceName));
  // const isTaken = await obj.some((element) => element.deviceName === dataSplit[1]);
  // console.log('listDevice status:', isTaken);
  // if (isTaken) {
  //   return 0;
  // }
  // nsole.log('listDevice Send:', obj);
  io.emit('listDevice', obj);
}

// on data callback broadcast to the default socketio connection
serialConnection.on('open', function () {
  serialConnection.on('data', function (data) {
    for (i = 0; i < data.length; i++) {
      if (String.fromCharCode(data[i]) !== '#') {
        fullData += String.fromCharCode(data[i]);
        stringValidate = false;
      } else {
        fullData += String.fromCharCode(data[i]);
        stringValidate = true;
        break;
      }
    }
    if (stringValidate === true) {
      main(fullData);
      io.emit('data', fullData);
      fullDataOld = fullData;
      fullData = '';
      stringValidate = false;
    }
  });
});

io.on('connection', (socket) => {
  socket.on('connectWiFi', (msg) => {
    console.log(`message: ${msg}`);
  });

  socket.on('saveData', (msg) => {
    console.log(`message: `,msg);
    if (msg !== null) {
      homeController.addData(msg);
    }
  });
});

const device = {
  deviceType: 'Cam Bien',
  deviceName: 'Ten',
  lastValue: 'Gia tri',
  deviceId: 0,
};

const obj = [];
obj.push(device);
const objString = JSON.stringify(obj, null, 2);

fs.writeFileSync(path.join(__dirname, 'controllers/device/list.device.json'), objString);
