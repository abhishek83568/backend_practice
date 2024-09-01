const mongoose=require('mongoose');

const blacklistSchema=new mongoose.Schema({
    blacklistToken:{
        type:String,
        required:true
    }
},{
    versionKey:false,
    timestamps:true
})


const BlacklistModel=mongoose.model('blacklistedToken',blacklistSchema)

module.exports=BlacklistModel