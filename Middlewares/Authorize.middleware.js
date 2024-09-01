const Authorize=(permittedRole)=>{
    return async(req,res,next)=>{
    try   {
    const role=req.user.role;
    if(permittedRole.includes(role)){
        next()
    }
    else{
        res.status(404).send(`Userrole is not authorized`)
    }



    } catch (error) {
        res.status(404).send(`Error in authorization ${error}`)
        
    }
}
}

module.exports=Authorize