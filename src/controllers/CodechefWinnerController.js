const asyncHandler = require("express-async-handler");
const Codechef = require("../models/contestModels/codechefModel");
const User = require("../models/userModel");
const Winner = require("../models/contestModels/codechefWinnerModel");
const axios = require("axios");
const backendUrl = process.env.BACKEND_URI;

// @desc PUT start rating
// @route PUT /api/winner/start
// @access public
const startRating = async (req, res) => {
  const apiKey = req.headers.authorization;
  if (apiKey !== `Bearer ${process.env.API_KEY}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const headers = {
      Authorization: apiKey,
    };
    const userData = await User.find({
      codechefId: { $exists: true },
    });

    for (const user of userData) {
      const codechef = await Codechef.findOne({ user_id: user._id });

      if (!codechef) {
        res.status(404);
        throw new Error("User not found");
      }

      const response = await axios.get(
        `${backendUrl}/api/contests/codechef/` + user.codechefId,
        { headers }
      );
      const responseData = response.data;

      codechef.beforeRating = responseData.currentRating;
      console.log(codechef.beforeRating);

      await codechef.save();
      console.log(`stored ${user.username}`);
    }
    res.status(201).send({ success: true });
  } catch (error) {
    console.log(error);
  }
};

// @desc PUT end rating
// @route PUT /api/winner/end
// @access public
const endRating = async (req, res) => {
  const apiKey = req.headers.authorization;
  if (apiKey !== `Bearer ${process.env.API_KEY}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const headers = {
      Authorization: apiKey,
    };
    const userData = await User.find({
      codechefId: { $exists: true },
    });
    for (const user of userData) {
      const codechef = await Codechef.findOne({ user_id: user._id });

      if (!codechef) {
        res.status(404);
        throw new Error("User not found");
      }
      const url = `https://www.codechef.com/users/${user.codechefId}`;
      const response = await axios.get(
        `${backendUrl}/api/contests/codechef/` + user.codechefId,
        { headers }
      );
      const responseData = response.data;
      codechef.afterRating = responseData.currentRating;
      codechef.currentRating = responseData.currentRating;
      if (responseData.stars && responseData.stars.match(/\d+/)) {
        codechef.stars = parseInt(responseData.stars.match(/\d+/)[0], 10);
      } else {
        codechef.stars = 1;
      }
      console.log(codechef.afterRating);
      await codechef.save();
      console.log(`stored ${user.username}`);
    }
    res.status(201).send({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// @desc PUT calculate difference
// @route PUT /api/winner/calculate
// @access public
// const calcWinner = async (req, res) => {
//   const apiKey = req.headers.authorization;
//   if (apiKey !== `Bearer ${process.env.API_KEY}`) {
//     res.status(401).json({ error: "Unauthorized" });
//     return;
//   }

//   try {

//     const userData = await User.find({
//       codechefId: { $exists: true },
//     });
//     for (const user of userData) {
//       const codechef = await Codechef.findOne({ user_id: user._id });
//       const winnerCalc = await Winner.findOne({ user_id: user._id });

//       if (!codechef || !winnerCalc) {
//         res.status(404);
//         throw new Error("User not found");
//       }

//       winnerCalc.ratingDiff = codechef.afterRating - codechef.beforeRating;
//       winnerCalc.stars = codechef.stars;
//       console.log(winnerCalc.ratingDiff);

//       await winnerCalc.save();
//       console.log(`stored ${user.username}`)

//     }
//     res.status(201).send({ success: true });
//   } catch (error) {
//     console.log(error);
//   }
// };

// @desc PUT generate winner
// @route PUT /api/winner/generate/:contestName
// @access public
const calcWinner = asyncHandler(async (req, res) => {
  const apiKey = req.headers.authorization;
  if (apiKey !== `Bearer ${process.env.API_KEY}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const searchQuery = req.params.contestName;

    const partialMatchParticipants = await Codechef.find({
      contestName: { $regex: new RegExp(searchQuery, "i") },
      success: true,
      isEnrolled: true,
    }).select("_id contestName stars contestGlobalRank contestRatingDiff").populate("user_id", "username libId branch sec codechefId rollNo");

    const exactMatchParticipants = await Codechef.find({
      contestName: searchQuery,
      success: true,
    }).select("-_id user_id");

    const allParticipantsSet = new Set([
      ...partialMatchParticipants,
      ...exactMatchParticipants,
    ]);
    const allParticipants = [...allParticipantsSet];

    res.status(200).json(allParticipants);
  } catch (error) {
    console.error("Error retrieving contest participants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = { startRating, endRating };
