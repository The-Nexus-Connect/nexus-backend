const mongoose = require ("mongoose");

const userSchema =new   mongoose.Schema(
    {
    userName:{type:String,required:true},
    branch:{
        type:String,
        enum:[
            "CSE(AI)",
            "CSE(AIML)"
        ],
    },
    email: { type: String, required: true },
    libId: { type: String, required:true }, 
    bio: { type: String },
    codeChefId: { type: String, required:true }, 
    password: { type: String, required: true },
    stars:{type:Number}
},
{
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
