const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const GeneralDatasCollection = require("../Models/GeneralDatasModel");
module.exports = {
  save: async (req, res) => {
    const generalDatasCollection = new GeneralDatasCollection({
      _id: new mongoose.Types.ObjectId(),
      dataName: req.body.dataName,
      datasList: req.body.datasList,
    });
    try {
      const result = await generalDatasCollection.save();
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  editgeneralData: async (req, res) => {
     const { _id, dataName, datasList} = req.body;
    const generalData = await GeneralDatasCollection.findOneAndUpdate(
      { dataName: dataName },
      { $set: {
          ...(datasList && { datasList }),}},
          { new: true } // Return the updated document
    );
    if (!generalData) return res.status(400).send("Invalid Credentials");
    res.json({ generalData });
  },
 generalDataGetByName: async (req, res) => {
    const generalData = await GeneralDatasCollection.findOne({
      dataName: req.params.dataName,
    });
    if (!generalData)
      return res.status(400).send("Invalid general Data");
    res.json({ generalData });
  },
  allgeneralDataGet: async (req, res) => {
    const generalData = await GeneralDatasCollection.find();
    if (!generalData)
      return res.status(400).send("Invalid general Data");
    res.json({ generalData });
  },
  deletegeneralDataId: async(req, res) => {
    const listingQuery = { _id: req.params.id };
    try {
      const generalData = await GeneralDatasCollection.deleteOne({ _id: req.params.id });
      if (generalData) {
        res.status(200).send(`ID ${req.params.id} Deleted Successfully!`);
      } else {
        res.status(204).json( "data not found");
      }
    } catch (err) {
      res.status(204).json( "data not found");
    }
  },
};
