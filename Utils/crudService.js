const mongoose = require("mongoose");

const crudService = {
  // Create a new document
  create: async (Model, data) => {
    try {
      const doc = new Model({
        _id: new mongoose.Types.ObjectId(),
        ...data,
      });
      return await doc.save();
    } catch (error) {
      throw error;
    }
  },

  // Read single document by filter
  getOne: async (Model, filter) => {
    try {
      return await Model.findOne(filter);
    } catch (error) {
      throw error;
    }
  },

  // Read all documents
  getAll: async (Model, filter = {}) => {
    try {
      return await Model.find(filter);
    } catch (error) {
      throw error;
    }
  },

  // Update one document
  updateOne: async (Model, filter, updateData) => {
    try {
      return await Model.findOneAndUpdate(filter, { $set: updateData }, { new: true });
    } catch (error) {
      throw error;
    }
  },

  // Delete one document
  deleteOne: async (Model, filter) => {
    try {
      return await Model.findOneAndDelete(filter);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = crudService;
