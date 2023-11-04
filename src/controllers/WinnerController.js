const Codechef = require("../models/contestModels/codechefModel");
const User = require("../models/userModel");
const axios = require("axios");


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
  
      codechef.currentRating = responseData.currentRating;
      await codechef.save();
      res.status(201).send({ success: true, data: codechef });
    }
  } catch (error) {
    
    console.error('Error:', error);
  }
  
  
}

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
        
        console.error('Error:', error);
      }
    
}


module.exports = {startRating,endRating};