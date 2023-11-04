const Codechef = require("../models/contestModels/codechefModel");
const User = require("../models/userModel");
const Winner = require("../models/contestModels/codechefWinnerModel")
const axios = require("axios");

// @desc PUT start rating
// @route PUT /api/winner/start
// @access public
const startRating = async (req,res)=>{

    try {
    const userData = await axios.get("https://nexus-backend-bmfi.onrender.com/api/users");
    
    for (const user of userData.data) {
      const codechef = await Codechef.findOne({ user_id: user._id });
  
      if (!codechef) {
        res.status(404);
        throw new Error("User not found");
      }
  
      const response = await axios.get("https://nexus-backend-bmfi.onrender.com/api/contests/codechef/" + user.codechefId);
      const responseData = response.data;
  
      codechef.beforeRating = responseData.currentRating;
      await codechef.save();
      res.status(201).send({ success: true, data: codechef });
    }
  } catch (error) {
    
    console.log(error);  }
  
  
}

// @desc PUT end rating
// @route PUT /api/winner/end
// @access public
const endRating = async (req,res)=>{
    try {
        const userData = await axios.get("https://nexus-backend-bmfi.onrender.com/api/users");
        
        for (const user of userData.data) {
          const codechef = await Codechef.findOne({ user_id: user._id });
      
          if (!codechef) {
            res.status(404);
            throw new Error("User not found");
          }
      
          const response = await axios.get("https://nexus-backend-bmfi.onrender.com/api/contests/codechef/" + user.codechefId);
          const responseData = response.data;
      
          codechef.afterRating = responseData.currentRating;
          await codechef.save();
          res.status(201).send({ success: true, data: codechef });

        }
      } catch (error) {
        
        console.log(error);
      }
    
}


// @desc PUT calculate difference
// @route PUT /api/winner/calculate
// @access public
const calcWinner = async (req,res)=>{
  try{
    const userData = await axios.get("https://nexus-backend-bmfi.onrender.com/api/users");
    for (const user of userData.data) {
      const codechef = await Codechef.findOne({ user_id: user._id });
      const winnerCalc = await Winner.findOne({ user_id: user._id });

      if (!codechef || !winnerCalc) {
        res.status(404);
        throw new Error("User not found");
      }

      winnerCalc.ratingDiff =  (codechef.beforeRating - codechef.afterRating);
      winnerCalc.stars = codechef.stars;
      await winnerCalc.save();
      res.status(201).send({ success: true, data: winnerCalc });

  }
}
  catch(error){
    console.log(error);  }
}

module.exports = {startRating,endRating,calcWinner};