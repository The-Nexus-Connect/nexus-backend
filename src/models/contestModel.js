const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    contestName: { type: String, required: true },
    contestCode: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: String, required: true },
    platform: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contest", contestSchema);
