const express = require('express');
const cors=require('cors')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')

require('dotenv').config();

//routes
const authRoute=require('./routes/userRoute')

// MIDDLEWARE
const app=express();
app.use(cors({ origin: true, credentials: true }));

//CONNECTING WITH MONGOOSE
mongoose.connect(process.env.URL,{useNewUrlParser:true,useUnifiedTopology:true}).then((res)=>{
    console.log("db connected")
    app.listen(process.env.PORT,()=>{
        console.log(`server running on ${process.env.PORT}`)
    })
}).catch(err=>console.log(err))


app.use(cookieParser())
app.use(express.json());

app.use('/api/auth',authRoute)