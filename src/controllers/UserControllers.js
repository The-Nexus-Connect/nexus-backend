// const asyncHandler= require("express-async-handler");
// const User = require("../models/userModel");

// //@desc Get all Users
// //@route Get /api/Users
// //@access public
// const getUsers = asyncHandler(async (req,res)=>{
//     const user  = await User.find();
//     res.status(200).json(user);
// });

// //@desc Create new Users
// //@route POST /api/Users
// //@access public
// const createUser =asyncHandler (async (req,res)=>{
//     console.log(req.body);
//     const {userName,branch,email,libId,bio,codeChefId,password,stars}=req.body;
//     const user = await User.create({
//         userName,
//         branch,
//         email,
//         libId,
//         bio,
//         codeChefId,
//         password,
//         stars
//         });
    
//       res.status(201).json(user);
   
// });

// //@desc get Users
// //@route GET /api/Users/:id
// //@access public
// const getUser = asyncHandler(async (req,res)=>{
//     const user = await User.findById(req.params.id);
//     if(!user){
//         res.status(404);
//         throw new Error ("User not found");
//     }
//     res.status(200).json(user);

// });

// //@desc update Users
// //@route PUT /api/Users/:id
// //@access public
// const updateUser = asyncHandler(async (req,res)=>{
//     const user = await User.findById(req.params.id);
//     if(!user){
//         res.status(404);
//         throw new Error ("User not found");
        
//     }
//     const updatedUser = await User.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//       );
    
//       res.status(200).json(updatedUser);

// });




// module.exports = { getUsers,createUser,getUser,updateUser };
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const {  userName,
            branch,
            email,
            libId,
            bio,
            codeChefId,
            password,
            stars} = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
