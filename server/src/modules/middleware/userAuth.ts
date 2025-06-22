import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userCollection } from '../users/user.model.js';
import {Types} from 'mongoose';


const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    console.log('-----------------------MIDDLEWARE(userAuth)-----------------------');
    console.log(req.method,' Request on',req.url);
   const jwt_token = req.cookies.jwt_token;
   if(!jwt_token){
    res.status(400).json({message:'token missing'});
    return
   }
   const decode = jwt.verify(jwt_token,process.env.JWT_SECRET!) as any;
   const user = await userCollection.findOne({_id:decode.userId});
   if(!user){
    res.status(404).json({message:'user not found'});
    return
   }
   req.userId = user._id as Types.ObjectId;
   next();
}

export default userAuth;
