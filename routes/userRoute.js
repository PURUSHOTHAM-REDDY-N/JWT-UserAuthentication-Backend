const express =require('express');
const {register, login}=require('../controllers/userController');
const { checkUser } = require('../Middilewares/AuthMiddlewares');

const router =express.Router();

// ROUTES

router.post("/",checkUser);

router.post('/register',register)

router.post('/login',login)

module.exports=router;

// PORT=503
// SECRET_KEY="purushotham reddy"
// URL="mongodb+srv://purushotham:purushotham@cluster0.9gpdgcz.mongodb.net/?retryWrites=true&w=majority"
