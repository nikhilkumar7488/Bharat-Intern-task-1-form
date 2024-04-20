const express = require("express");
const mongoose = require("mongoose");
const bodyparser =require("body-parser");
const dotenv =require("dotenv");

const app=express();
dotenv.config();

const port = process.env.PORT || 3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.tc7cr5e.mongodb.net/RegistrationFormdb`,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const registrationSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const Registration = mongoose.model("Registration",registrationSchema);

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/form.html");
})

app.post("/register",async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existinguser=await Registration.findOne({email : email});
        if(!existinguser){   
        const registrationData=new Registration({
            name,
            email,
            password,
        });
        await registrationData.save();
        res.redirect("/success"); 
        console.log("no error detected");  
    }
    else{
       alert("user already exist");
        res.redirect("/error");
    }
    }
    catch{
        console.log('error');
        res.redirect("/error");
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/success.html");})

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/error.html");
    console.log("file error");
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})