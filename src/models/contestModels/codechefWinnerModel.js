const mongoose = require("mongoose");
const winnerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  username: { type: String },
  ratingDiff: { type: Number },
  stars: { type: Number },
});

module.exports = mongoose.model("Winner", winnerSchema);
