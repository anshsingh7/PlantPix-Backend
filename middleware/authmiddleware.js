import jwt from "jsonwebtoken";
import User from "../schema/userSchema.js";
import dotenv from "dotenv";
dotenv.config();

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = await jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET||"abrraKaDabra"
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error)
  }
};

//admin access
export const isAdmin = async (req, res, next)=>{
    try{
        const user = await User.findById(req.user._id)
        if(user.role !== 0){
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access"
            });
        }else{
            next()
        }
    }catch(error){
        console.log(error)
        res.status(401).send({
            success: false,
            error,
            message: "Error is admin middleware"
        })
    }
}
