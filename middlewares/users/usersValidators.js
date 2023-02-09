const {check,validationResult}=require("express-validator");
const createError = require("http-errors");

const User = require("../../model/People");
const path = require("path");
const {unlink}=require("fs");

const addUserValidators=[
    check("name").isLength({min:1}).withMessage("Name is required").isAlpha("en-us",{ignore:"-"}).withMessage("Name must not contain anything other than alphabet").trim(),
    check("email").isEmail().withMessage("Invalid email message").trim().custom(async(value)=>{
        try{
            const user = await User.findOne({email:value});
            if(user){
                throw createError("EMail is already use");
            }
        }catch(err){
            throw createError(err.message);
        }
    }),
    check("mobile").isMobilePhone("bn-BD",{
        strictMode:true,
    }).withMessage("Mobile Number Must be Valid with Bangladeshi Mobile Number").custom(async(value)=>{
        try{
            const user = await User.findOne({mobile:value});
            if(user){
                throw createError("EMail is already use");
            }
        }catch(err){
            throw createError(err.message);
        }
    }),
    check("password").isStrongPassword().withMessage("Password must be at least * characters long and should contain at least 1 lowecase, 1 uppercase, 1 number & 1 symbol")
]


const addUserValidationHandler = function(req,res,next){
    const errors = validationResult(req);
    const mappedError = errors.mapped();
    if(Object.keys(mappedError).length===0){
        next();
    }else{
        if(req.files.length >0){
            const {filename}=req.files[0];
            unlink(
                path.join(__dirname,`/../public/uploads/avatars/${filename}`),
                (err)=>{
                    if(err)console.log(err);
                }
            )
        }
    }
    //response the error

    res.status(500).json({
        errors:mappedError,
    });
};


module.exports={
    addUserValidators,
    addUserValidationHandler
}