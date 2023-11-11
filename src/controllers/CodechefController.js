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

    const contestGlobalRank= parseInt(
      document.querySelector(".global-rank").innerHTML
    );
    const contestRatingDiff=parseInt(
      document.querySelector(".rating-difference").innerHTML
    )

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
// @route PUT api/contests/codechef/rating/rerun
// @access public
const restoreRatings = async (req, res) => {
  const apiKey = req.headers.authorization;
  if (apiKey !== `Bearer ${process.env.API_KEY}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const userData = await User.find({
      codechefId: { $exists: true },
    });
    for (const user of userData) {
      const headers = {
        Authorization: `Bearer ${apiKey}`,
      };
      try {
        const response = await axios.put(
          `${backendUrl}/api/contests/codechef/${user._id}`,
          null,
          {
            headers,
          }
        );

        if (response.status === 200) {
          console.log(response);
        }
      } catch (error) {
        console.error(error);
      }
    }
    const result = await Codechef.find({
      success: true,
    });
    res.status(201).send({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.send({ error: "can't find user" });
  }
};

module.exports = {
  getCodechefProfile,
  updateCodechefProfile,
  enrollUser,
  restoreRatings,
};
