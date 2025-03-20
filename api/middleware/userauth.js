import jwt from 'jsonwebtoken'
import { handleError } from "../helpers/handleError.js"



const userauth = async (req, res, next)=>{
    const {token} = req.cookies

    if(!token){
        return res.status(500).json({
            success: false,
            message: 'Not Authorized.'
        })
    }
    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id
        }else{
            return res.status(500).json({
                success: false,
                message: 'Not Authorized.'
            })
        }
        next()

    }catch(error){
        next(handleError(500, error.message))
    }
}
export default userauth