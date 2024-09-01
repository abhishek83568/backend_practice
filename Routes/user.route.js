const express=require('express');
const UserModel = require('../Models/user.model');
const dotenv=require('dotenv').config();
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const BlacklistModel = require('../Models/blacklisting.model');

const userRouter=express.Router();

userRouter.post('/register',async(req,res)=>{
    try {
        const {username,email,role,password}=req.body;
        const existingUser=await UserModel.findOne({email});
        if(existingUser){
            return res.status(404).send(`User already registered`)
        }
        bcrypt.hash(password, 5,async function(err, hash) {
            if(err){
              return res.status(404).send(`Error while hashing password`)
            }

            if(hash){
                const newUser=new UserModel({
                    username,email,password:hash,role
                })

                await newUser.save()

                res.status(201).json({
                    message:'User registered successfully',newUser
                })
            }
        });
    } catch (error) {
        res.status(404).send(`Error while registering ${error}`)
    }
})

userRouter.post('/login',async(req,res)=>{
    try {
        const {email,password}=req.body;

        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(404).send(`User not found`)
        }
        bcrypt.compare(password, user.password, function(err, result) {
            if(err){
               return res.status(404).send(`Wrong password ${err}`)
            }
            if(result){
                 
                const token = jwt.sign({ id:user._id }, process.env.SECRET_KEY);

                res.status(202).json({
                    message:'Login Successfull',token
                })

            }
        });

    } catch (error) {
        res.status(404).send(`Error while loggingIn ${error}`)
    }
})


userRouter.get('/logout',async(req,res)=>{
    try {
        if(!req.headers.authorization){
            return res.status(401).json({ message: 'Authorization header is missing' });
        }
        const token=req.headers.authorization.split(" ")[1]

        

        const blacklistedToken=new BlacklistModel({
         blacklistToken:token
        })
 
        await blacklistedToken.save();
        res.status(203).send("User logout successfully")
    } catch (error) {
        res.status(500).json({ message: `Error during logout: ${error.message}` });
    }
})

module.exports=userRouter