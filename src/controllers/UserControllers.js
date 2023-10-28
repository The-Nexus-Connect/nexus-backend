//@desc Get all Users
//@route Get /api/Users
//@access public
const getUsers = (req,res)=>{
    res.status(200).json({message:"Get all Users"});
};

//@desc Create new Users
//@route POST /api/Users
//@access public
const createUser = (req,res)=>{
    console.log(req.body);
    res.status(201).json({message:"Create Users"});

};

//@desc get Users
//@route GET /api/Users/:id
//@access public
const getUser = (req,res)=>{
    res.status(200).json({message:`Get Users for ${req.params.id}`});

};

//@desc update Users
//@route PUT /api/Users/:id
//@access public
const updateUser = (req,res)=>{
    res.status(200).json({message:`Update Users for ${req.params.id}`});

};

// @desc delete Users
// @route DELETE /api/Users/:id
// @access public
const deleteUser =(req,res)=>{
    res.status(200).json({message:`delete Users for ${req.params.id}`});

}


module.exports = { getUsers,createUser,getUser,deleteUser,updateUser };

