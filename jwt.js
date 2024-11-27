const generateToken = (user,message,res)=>{
    const token = user.jsonWebToken();
    //console.log(token);
    
    //const cookieName = user.role ==="Student"? "studentToken": "teacherToken"
    const cookieName ="user";
    res.status(200).cookie(cookieName,token,{
        expires: new Date(Date.now()+ 24*60*60*1000),
        httpOnly: true
    }).json({
        success: true,
        message,
        user,
        token
    })
}

module.exports = generateToken