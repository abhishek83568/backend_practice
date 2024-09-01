const jwt=require('jsonwebtoken');
const UserModel = require('../Models/user.model');
const BlacklistModel = require('../Models/blacklisting.model');
const dotenv=require('dotenv').config();
const Auth=async(req,res,next)=>{
  try {
    if(!req.headers.authorization){
        return res.status(404).send(`Token not found`)
    }

    const token=req.headers.authorization.split(" ")[1]

    const blacklistedToken=await BlacklistModel.findOne({
        blacklistToken:token
     })
    
     if(blacklistedToken){
        return res.status(402).send('You are logged out ,Please login again')
     }
    jwt.verify(token, process.env.SECRET_KEY,async function(err, decoded) {
        if(err){
            return res.status(400).send(`Wrong token`)
        }

        if(decoded){
            const userId=decoded.id;

            const user=await UserModel.findById(userId)
            req.user=user;
            next()
        }
      });
  } catch (error) {
    console.log(error)
  }
}

module.exports=Auth