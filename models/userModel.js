const mongoose=require('mongoose')
const bcrypt=require('bcrypt')


// CREATING SCHEMa to store data

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minLength:[4,"UserName should be greater than 4 characters"],
        maxLength:30,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        maxLength:50,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"password should be greater than 8 characters"],
        maxLength:30
    }
})

//hashing password

userSchema.pre("save",async function(next){
  
  const salt=await bcrypt.genSalt();
  this.password= await bcrypt.hash(this.password,salt);
  
  next();

})



// CREATING A FUNCTION TO CHECK THE USER IN THE DATABASE
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error("incorrect password");
    }
    throw Error("incorrect email");
  };

module.exports= mongoose.model("Users",userSchema);