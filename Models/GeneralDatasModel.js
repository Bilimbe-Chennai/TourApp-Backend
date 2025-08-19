const mongoose = require("mongoose");
module.exports = new mongoose.model(
  "generaldatas",
   new mongoose.Schema({
     dataName: { type: String, required:true  },
     datasList: { type: Array, required:true  },
     createdAt: { type: Date, default: Date.now },
   })
);