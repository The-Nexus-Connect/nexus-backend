const mongoose = require("mongoose");
const winnerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: { type: String },
    libId: { type: String },
    branch: { type: String },
    sec: { type: String },
    stars: { type: Number },
    rank: { type: Number },
    contestGlobalRank: { type: Number },
    contestRatingDiff: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Winner", winnerSchema);
