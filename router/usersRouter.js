//external import

const express = require('express');
const router = express.Router();
const {getUsers, addUser}=require("../controller/usersController");
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const avatarUpload = require('../middlewares/users/avatarUpload');
const {check}=require('express-validator');
const { addUserValidators, addUserValidationHandler } = require('../middlewares/users/usersValidators');

//users page
router.get("/",decorateHtmlResponse("Users"),getUsers);


//add users

router.post("/",avatarUpload,addUserValidators,addUserValidationHandler,addUser);

module.exports=router;