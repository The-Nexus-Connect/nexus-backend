const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date },
    platform: { type: String },
    isEnrolled: { type: Boolean },
    totalParticipant: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contest", contestSchema);
