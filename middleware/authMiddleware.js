import jwt from "jsonwebtoken"

export const authMiddleware = async(req,res,next)=>{
    const token = req.cookies.token
    const id= req.params.id


    if(!token){
        return res.status(400).json({message:" Login First"})
    }
    try {
        const decodedToken = jwt.verify(token,process.env.SECRET_KEY);
        req.userID =decodedToken.userID
        if(id!==decodedToken.userID){
            return res.status(400).json({message:" Access Denied"})
        }
    } catch (error) {
        res.status(500).json(console.log(error))
    }
}