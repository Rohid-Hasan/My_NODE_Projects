module.exports = (req,res,next)=>{
  if(req.isAuth===false){
    return res.redirect("/");
  }

  next();
}