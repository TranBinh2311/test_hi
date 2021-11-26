const httpStatus = require('http-status');
// eslint-disable-next-line import/order
const catchAsync = require('../utils/catchAsync');
const fs = require('fs').promises;
const fsystem = require('fs');
const path = require('path');
const moment = require("moment");
const childProc = require("child_process");

const mainMenu = catchAsync(async (req, res) => {
  const rawdata = await fs.readFile(path.join(__dirname, '/device/list.device.json'));
  const listDeivce = JSON.parse(rawdata);
  res.render('index', {
    listDeivce,
  });
});

const addDevice = catchAsync(async (req, res) => {
  const device = req.body;
  const data = fsystem.readFileSync(path.join(__dirname, '/device/list.device.json'), {
    encoding: 'utf8',
    flag: 'r',
  });
  const obj = JSON.parse(data);
  if (device.deviceName === obj.deviceName && device.deviceType === obj.deviceType)
    res.status(204).send({ Mes: 'Thiết bị đã tồn tại' });
  else {
    device.deviceId = obj.length; // auto identify
    obj.push(device); // add data
    const json = JSON.stringify(obj, null, 2); // convert it back to json
    fsystem.writeFileSync(path.join(__dirname, '/device/list.device.json'), json);
    res.status(200).send({ message: 'Add Device Success' });
  }
});

const updateDeviceValue = catchAsync(async (req, res) => {
  const device = req.body;
  const data = fsystem.readFileSync(path.join(__dirname, '/device/list.device.json'), {
    encoding: 'utf8',
    flag: 'r',
  });
  const obj = JSON.parse(data);
  if (device.deviceId === obj.deviceId) {
    const index = device.deviceId;
    obj[index].lastUpdate = device.lastUpdate;
    obj[index].lastValue = device.lastValue;
    const json = JSON.stringify(obj, null, 2); // convert it back to json
    fsystem.writeFileSync(path.join(__dirname, '/device/list.device.json'), json);
    res.status(200).send();
  }
});

const removeDevice = catchAsync(async (req, res) => {
  const device = req.body;
  const data = fsystem.readFileSync(path.join(__dirname, '/device/list.device.json'), {
    encoding: 'utf8',
    flag: 'r',
  });
  const obj = JSON.parse(data);
  const index = obj.map((element) => element.deviceId).indexOf(device.deviceId); // hao map
  if (index > -1) {
    obj.splice(index, 1);
  }
  const json = JSON.stringify(obj, null, 2); // convert it back to json
  fsystem.writeFileSync(path.join(__dirname, '/device/list.device.json'), json);
  res.status(200).send();
});

const realTimeData = catchAsync(async (req, res) => {
  res.render('realTimeData');
});

const test = catchAsync(async (req, res) => {
  res.render('test');
});

const addData = async (req) => {
  const dataRealtime = req;
  const fileNameGenarate = '/data/'+dataRealtime.fileName + (new Date()).getTime()+'.json';
  const objString = JSON.stringify(dataRealtime.Data, null, 2);
  fsystem.writeFileSync(path.join(__dirname, fileNameGenarate), objString);
};

const shutDown = async(req) =>{
  childProc.exec('sudo shutdown -h now');
}

module.exports = {
  mainMenu,
  test,
  realTimeData,
  addDevice,
  removeDevice,
  updateDeviceValue,
  addData,
  shutDown,
};
