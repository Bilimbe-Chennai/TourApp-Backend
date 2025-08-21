const express = require("express");
const generalDatasController = require("../Controllers/GeneralDatasController");
const router = express.Router();
//general datas get router
router.get(process.env.BASE_GENERALDATACOLLECTION_GETDATABYNAME_URI+"/:dataName", generalDatasController.generalDataGetByName);
router.get(process.env.BASE_GENERALDATACOLLECTION_GETALL_URI, generalDatasController.allgeneralDataGet);
router.post(process.env.BASE_GENERALDATACOLLECTION_CREATEDATABYNAME_URI, generalDatasController.save);
router.put(process.env.BASE_GENERALDATACOLLECTION_EDITDATABYNAME_URI, generalDatasController.editgeneralData);
router.delete(process.env.BASE_GENERALDATACOLLECTION_DELETEDATABYNAME_URI+"/:id", generalDatasController.deletegeneralDataId);
module.exports = router;
