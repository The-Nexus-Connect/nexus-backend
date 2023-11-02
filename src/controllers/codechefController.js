const axios = require("axios");
const jsdom = require("jsdom");
const express = require("express");
const app = express();
const { JSDOM } = jsdom;
const Codechef = require("../models/contestModels/codechefModel");


// @desc Get codechef profile
// @route Get api/contest/codechef/:id
// @access public

const getCodechefProfile = async (req, res) => {
  try {
    let data = await axios.get(
      `https://www.codechef.com/users/${req.params.id}`
    );
    let dom = new JSDOM(data.data);
    let document = dom.window.document;
    res.status(200).send({
      success: true,
      profile: document.querySelector(".user-details-container").children[0]
        .children[0].src,
      name: document.querySelector(".user-details-container").children[0]
        .children[1].textContent,
      currentRating: parseInt(
        document.querySelector(".rating-number").textContent
      ),
      highestRating: parseInt(
        document
          .querySelector(".rating-number")
          .parentNode.children[4].textContent.split("Rating")[1]
      ),
      countryFlag: document.querySelector(".user-country-flag").src,
      countryName: document.querySelector(".user-country-name").textContent,
      globalRank: parseInt(
        document.querySelector(".rating-ranks").children[0].children[0]
          .children[0].children[0].innerHTML
      ),
      countryRank: parseInt(
        document.querySelector(".rating-ranks").children[0].children[1]
          .children[0].children[0].innerHTML
      ),
      stars: document.querySelector(".rating").textContent || "unrated",
    });
  } catch (err) {
    console.log(err);
    res.send({ success: false, error: err });
  }
};

// @desc Post codechef profile
// @route Post api/contest/codechef/
// @access public
const postCodechefProfile = async (req, res) => {
  try {
    const codeChefData = await getCodechefProfile(req, res);

    if (!codeChefData || !codeChefData.success) {
      return res
        .status(500)
        .send({ success: false, error: "CodeChef data retrieval failed" });
    }

    console.log(codeChefData);

    // Modify the user identification logic based on your authentication
    const user_id = req.user ? req.user._id : null;

    // Create a new Codechef document using the Mongoose model
    const codechefDocument = new Codechef({
      user_id: user_id,
      success: codeChefData.success,
      profile: codeChefData.profile,
      currentRating: codeChefData.currentRating,
      highestRating: codeChefData.highestRating,
      globalRank: codeChefData.globalRank,
      countryRank: codeChefData.countryRank,
      stars: codeChefData.stars,
    });

    await codechefDocument.save();

    // Send a response indicating success
    res
      .status(200)
      .send({ success: true, message: "CodeChef data saved successfully" });
  } catch (err) {
    console.log(err);
    // Send an error response
    res.status(500).send({
      success: false,
      error: "Error saving CodeChef data: " + err.message,
    });
  }
};

module.exports = { getCodechefProfile, postCodechefProfile };
