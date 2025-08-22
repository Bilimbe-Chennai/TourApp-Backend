const mongoose = require("mongoose");
module.exports = new mongoose.model(
  "admins",
   new mongoose.Schema({
     name: { type: String, required:true  },
     company_name: { type: String },
     email: { type: String, required:true,unique:true  },
     mobile_number: { type: Number, required:true },
     password: { type: String, required:true },
     user_type: { type: String, required:true  },
     createdAt: { type: Date, default: Date.now },
     status:{ type: String,default:"Active" },
   })
);