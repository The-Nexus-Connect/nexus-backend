const axios = require("axios");
const jsdom = require("jsdom");
const express = require("express");
const app = express();
const { JSDOM } = jsdom;
const Codechef = require("../models/contestModels/codechefModel");
const User = require("../models/userModel");
const { get } = require("mongoose");
const backendUrl = process.env.BACKEND_URI;

// @desc Get codechef profile
// @route Get api/contests/codechef/:id
// @access public

const getCodechefProfile = async (req, res) => {
  try {
    const apiKey = req.headers.authorization;
    if (apiKey !== `Bearer ${process.env.API_KEY}`) {
      throw new Error("Unauthorized");
    }

    const response = await axios.get(
      `https://www.codechef.com/users/${req.params.id}`
    );

    // Parse HTML
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Extract information
    const profileImage = document.querySelector(".user-details-container")
      .children[0].children[0].src;
    const name = document.querySelector(".user-details-container").children[0]
      .children[1].textContent;
    const currentRating = parseInt(
      document.querySelector(".rating-number").textContent
    );
    const highestRating = parseInt(
      document
        .querySelector(".rating-number")
        .parentNode.children[4].textContent.split("Rating")[1]
    );
    const countryFlag = document.querySelector(".user-country-flag").src;
    const countryName =
      document.querySelector(".user-country-name").textContent;
    const globalRank = parseInt(
      document.querySelector(".rating-ranks").children[0].children[0]
        .children[0].children[0].innerHTML
    );
    const countryRank = parseInt(
      document.querySelector(".rating-ranks").children[0].children[1]
        .children[0].children[0].innerHTML
    );
    const stars = document.querySelector(".rating").textContent || "unrated";

    const contestGlobalRank = parseInt(
      document.querySelector(".global-rank").innerHTML
    );
    const contestRatingDiff = parseInt(
      document.querySelector(".rating-difference").innerHTML
    );

    // Send success response
    res.status(200).json({
      success: true,
      profile: profileImage,
      name,
      currentRating,
      highestRating,
      countryFlag,
      countryName,
      globalRank,
      countryRank,
      stars,
      contestGlobalRank,
      contestRatingDiff,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, error: error.message });
  }
};

// @desc Update codechef profile
// @route PUT api/contests/codechef/:id
// @access public
const updateCodechefProfile = async (req, res) => {
  const apiKey = req.headers.authorization;
  if (apiKey !== `Bearer ${process.env.API_KEY}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const apiKey = process.env.API_KEY;

    const headers = {
      Authorization: `Bearer ${apiKey}`,
    };

    const response = await axios.get(
      `${backendUrl}/api/contests/codechef/` + user.codechefId,
      { headers }
    );
    const responseData = response.data;
    try {
      const codechef = await Codechef.findOne({ user_id: req.params.id });
      if (codechef) {
        codechef.success = true;
        codechef.profile = responseData.profile;
        codechef.name = responseData.name;
        codechef.currentRating = responseData.currentRating;
        codechef.globalRank = responseData.globalRank || null;
        codechef.countryRank = responseData.countryRank || null;
        codechef.contestGlobalRank = responseData.contestGlobalRank || null;
        codechef.contestRatingDiff = responseData.contestRatingDiff || null;
        if (responseData.stars && responseData.stars.match(/\d+/)) {
          codechef.stars = parseInt(responseData.stars.match(/\d+/)[0], 10);
        } else {
          codechef.stars = 1;
        }

        await codechef.save();
        user.userImg = responseData.profile;
        await user.save();
        res.status(201).send({ success: true, data: codechef });
      } else {
        console.log("No document found");
      }
    } catch (error) {
      console.error(error);
    }
  } catch (err) {
    console.log(err);
    res.send({ success: false, error: err });
  }
};

// @desc Enroll user
// @route PUT api/contests/codechef/enroll/:id
// @access public

const enrollUser = async (req, res) => {
  const apiKey = req.headers.authorization;
  if (apiKey !== `Bearer ${process.env.API_KEY}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const codechefUser = await Codechef.findOne({ user_id: req.params.id });
    if (!codechefUser) {
      res.status(404);
      throw new Error("User not found");
    }
    codechefUser.isEnrolled = true;
    await codechefUser.save();
    res.status(201).send({ success: true, data: codechefUser });
  } catch (error) {
    console.error(error);
    res.send({ error: "can't find user" });
  }
};

// @desc rerun the codechefId datails
// @route PUT api/contests/codechef/update/allusers
// @access public
// const restoreRatings = async (req, res) => {
//   const apiKey = req.headers.authorization;

//   if (apiKey !== `Bearer ${process.env.API_KEY}`) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   try {
//     const userData = await User.find({ codechefId: { $exists: true } });

//     const updateUserPromises = userData.map(async (user) => {
//       try {
//         // Make PUT request to update Codechef ratings
//         const response = await axios.put(
//           `${backendUrl}/api/contests/codechef/${user._id}`,
//           null, // Replace null with your payload data if needed
//           {
//             headers: {
//               Authorization: `Bearer ${apiKey}`,
//             },
//           }
//         );

//         // if (response.status === 200) {
//         //   console.log(`User ${user._id} updated successfully`);
//         // }
//       } catch (error) {
//         console.error(`Error updating user ${user._id}:`, error);
//         // Continue with the next user in case of an error
//       }
//     });

//     // Wait for all update promises to resolve
//     await Promise.all(updateUserPromises);

//     // Fetch the updated Codechef documents
//     const updatedCodechefData = await Codechef.find({ success: true });

//     res.status(201).send({ success: true, data: updatedCodechefData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };
const updateAllCodechefProfiles = async (req, res) => {
  const apiKey = req.headers.authorization;
  if (apiKey !== `Bearer ${process.env.API_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
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

      let stars = 1;

      if (responseData.stars && responseData.stars.match(/\d+/)) {
        stars = parseInt(responseData.stars.match(/\d+/)[0], 10);
      }

      codechef.set({
        currentRating: responseData.currentRating,
        highestRating: responseData.highestRating,
        globalRank: responseData.globalRank,
        countryRank: responseData.countryRank,
        stars: stars,
        contestGlobalRank: responseData.contestGlobalRank,
        contestRatingDiff: responseData.contestRatingDiff,
      });

      await codechef.save();
      console.log(`stored ${user.username}`);
    }
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  getCodechefProfile,
  updateCodechefProfile,
  enrollUser,
  updateAllCodechefProfiles,
};
