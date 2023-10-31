const mongoose = require("mongoose");

const codechefSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isEnrolled: { type: Boolean, required: true , default: false},
    currentRating: { type: Number, required: true },
    afterRating: { type: Number, required: true },
    globalRank: { type: Number, required: true },
    platform: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Codechef", codechefSchema);
