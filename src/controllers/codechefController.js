const axios = require("axios");
const jsdom = require("jsdom");
const express = require("express");
const app = express();
const { JSDOM } = jsdom;

// @desc Get codechef profile
// @route Get api/contest/:id/:handle
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

module.exports = { getCodechefProfile };
