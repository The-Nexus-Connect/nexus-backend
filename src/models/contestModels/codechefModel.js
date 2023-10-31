const mongoose = require("mongoose");

const codechefSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isEnrolled: { type: Boolean, required: true , default: false},
    success:{type:Boolean},
    profile:{type: String},
    
    currentRating: { type: Number, required: true },
    afterRating: { type: Number, required: true },
    highestRating:{ type: Number},
    globalRank: { type: Number },
    countryRank: { type: Number },
    platform: { type: String, required: true },
    starts:{ type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Codechef", codechefSchema);
