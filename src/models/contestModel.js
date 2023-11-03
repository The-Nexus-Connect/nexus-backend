const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date },
    contestLink:{type:String},
    totalParticipant: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contest", contestSchema);
