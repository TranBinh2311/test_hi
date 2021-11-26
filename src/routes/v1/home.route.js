const express = require('express');
const validate = require('../../middlewares/validate');
const homeController = require('../../controllers/home.controller');

const router = express.Router();

router.get('/', homeController.mainMenu);
router.get('/test', homeController.test);
router.get('/data', homeController.realTimeData);
router.post('/addDevice', homeController.addDevice);
router.post('/removeDevice', homeController.removeDevice);
router.post('/updateDevice', homeController.updateDeviceValue);
router.get('/shutdown', homeController.shutDown);

module.exports = router;
