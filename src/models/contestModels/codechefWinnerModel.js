const mongoose = require("mongoose");
const winnerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  username: { type: String },
  libId: { type: String },
  branch: { type: String },
  ratingDiff: { type: Number },
  stars: { type: Number },
  rank: { type: Number },
});

module.exports = mongoose.model("Winner", winnerSchema);
