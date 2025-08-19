const express = require("express");
const generalDatasController = require("../Controllers/GeneralDatasController");
const router = express.Router();
//general datas get router
router.get(process.env.BASE_GENERALDATACOLLECTION_GETDATABYNAME_URI+"/:dataName", generalDatasController.generalDataGetByName);
router.post(process.env.BASE_GENERALDATACOLLECTION_CREATEDATABYNAME_URI+"/generaldata", generalDatasController.save);
router.put(process.env.BASE_GENERALDATACOLLECTION_EDITDATABYNAME_URI+"/generaldata", generalDatasController.editgeneralData);
module.exports = router;
