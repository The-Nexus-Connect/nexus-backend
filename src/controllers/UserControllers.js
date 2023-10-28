const asyncHandler= require("express-async-handler");
const User = require("../models/userModel");

//@desc Get all Users
//@route Get /api/Users
//@access public
const getUsers = asyncHandler(async (req,res)=>{
    const user  = await User.find();
    res.status(200).json(user);
});

//@desc Create new Users
//@route POST /api/Users
//@access public
const createUser =asyncHandler (async (req,res)=>{
    console.log(req.body);
    const {userName,branch,email,libId,bio,codeChefId,password,stars}=req.body;
    const user = await User.create({
        userName,
        branch,
        email,
        libId,
        bio,
        codeChefId,
        password,
        stars
       

      });
    
      res.status(201).json(user);
   
});

//@desc get Users
//@route GET /api/Users/:id
//@access public
const getUser = asyncHandler(async (req,res)=>{
    res.status(200).json({message:`Get Users for ${req.params.id}`});

});

//@desc update Users
//@route PUT /api/Users/:id
//@access public
const updateUser = asyncHandler(async (req,res)=>{
    res.status(200).json({message:`Update Users for ${req.params.id}`});

});

// @desc delete Users
// @route DELETE /api/Users/:id
// @access public
const deleteUser =asyncHandler(async (req,res)=>{
    res.status(200).json({message:`delete Users for ${req.params.id}`});

});


module.exports = { getUsers,createUser,getUser,deleteUser,updateUser };

