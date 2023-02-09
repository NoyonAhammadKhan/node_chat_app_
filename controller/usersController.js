
const bcrypt = require('bcrypt');

const User =require('../model/People')

async function getUsers(req,res,next){
    try{
        const users = await User.find();
        res.render("users",{
            users:users
        })
    }catch(err){
        next(err);
    }
}


//addUser
async function addUser(req,res,next){
    console.log(req.body)
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if(req.filter && req.files.length > 0){
        newUser = new User({
            ...req.body,
            avatar:req.files[0].fileName,
            password:hashedPassword
        });
    }else{
        newUser = new User({
            ...req.body,
            password:hashedPassword
        })
    }

    try{
        const result = await newUser.save();
        res.status(200).json({
            message:"User was added successfully!!"
        })
    }catch(e){
        res.status(500).json({
            errors:{
                common:{
                    msg:"Unknown error occured!!!"
                }
            }
        })
    }
}

async function removeUser(req,res,next){
    try{
        const user = await User.findByIdAndDelete({
            _id:req.params.id,
        })
    }catch(err){
        
    }
}

module.exports = {
    getUsers,
    addUser
}