const jwt = require("jsonwebtoken")

function verifyToken(req, res, next){
    const token = req.headers.token;
    if (!token) return res.json({error:"Must be Logged In"});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.userId = decoded.userId;
        next();
    }
    catch(error){
        console.log(error);
        return res.json({error: "Session Expired. Please Log In again"})
    }
}

module.exports = verifyToken;