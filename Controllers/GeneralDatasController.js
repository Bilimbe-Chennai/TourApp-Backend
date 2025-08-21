const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crudService = require("../Utils/crudService");
const GeneralDatasCollection = require("../Models/GeneralDatasModel");
module.exports = {
  save: async (req, res) => {
    try {
       const result = await crudService.create(GeneralDatasCollection, {
        ...req.body,
        _id: new mongoose.Types.ObjectId(),
      });
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  editgeneralData: async (req, res) => {
    try {
      const { _id, dataName, datasList} = req.body;
      const generalData = await crudService.updateOne(GeneralDatasCollection, { dataName }, { datasList });
      if (!generalData) return res.status(400).send("Invalid Data");
      res.json({ generalData });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
 generalDataGetByName: async (req, res) => {
    try {
    const generalData = await crudService.getOne(GeneralDatasCollection,{
      dataName: req.params.dataName,
    });
    if (!generalData)
      return res.status(400).send("Invalid general Data");
    res.json({ generalData });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  allgeneralDataGet: async (req, res) => {
      try {
    const generalData = await crudService.getAll(GeneralDatasCollection);
    if (!generalData)
      return res.status(400).send("Invalid general Data");
    res.json({ generalData });
     } catch (error) {
       console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  deletegeneralDataId: async(req, res) => {
    const _id =  req.params.id ;
    try {
      const generalData = await crudService.deleteOne(GeneralDatasCollection,{ _id});
      if (generalData) {
        res.status(200).send(`ID ${req.params.id} Deleted Successfully!`);
      } else {
        res.status(400).json( "data not found");
      }
    } catch (err) {
      res.status(500).json( "data not found");
    }
  },
};
