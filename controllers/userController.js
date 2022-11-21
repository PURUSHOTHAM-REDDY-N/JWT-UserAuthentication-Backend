const User=require("../models/userModel")
const jwt= require("jsonwebtoken")


//CREATING A JSON WEB TOKEN FOR USER AUTHENTICATION

const maxAge=3*24*60*60;

const createToken = (id) => {
    return jwt.sign({id},process.env.SECRET_KEY,
    {expiresIn:maxAge},

    )
}

const handleErrors=(err)=>{
    let errors = { username:"",email: "", password: "" };

  

  //login errors
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  //register errors
  if (err.message.includes("username")) {
    
    errors.username = "Username is already registered";
    return errors;
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}


//REGISTER MODULE TO STORE DATA IN THE DATABASE

module.exports.register=async (req,res,next) => {
  

   try {

    const {username,email,password}=req.body;

    

    const user=await User.create({
        email,
        username,
        password
    })
    delete user.password


    const token=createToken(user._id);

     res.cookie("jwt",token,{
        withCredentials:true,
        httpOnly:false,
        domain: 'www.purushotham.dev',
        maxAge:maxAge*1000});
        
        res.status(201).json({user:user._id,created:true})
        
        
    } catch (err) {
        
        const errors= handleErrors(err)
        res.json({errors,created:false})
    }
    
}


// CALLING  FUNCTION PRESENT IN THE USERMODEL FILE

module.exports.login=async (req,res,next)=>{
    
    
    try {
        const {email,password}=req.body;
        
        const user=await User.login(email,password)
        
        if(user){
            const token=createToken(user._id);
            
            res.cookie("jwt",token,{
                withCredentials:true,
                httpOnly:false,
                maxAge:maxAge*1000});

                
                // res.json("successfully logged in")
            }
            res.send();
        next();
        
    } catch (error) {
        
        
        const errors= handleErrors(error)
        res.json({errors,created:false})
    }

}
