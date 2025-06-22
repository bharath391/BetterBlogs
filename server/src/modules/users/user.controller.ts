import { Request, Response } from 'express';
import { IUser, userCollection } from './user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { strict } from 'assert';

const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.body) {
      res.status(400).json({ msg: 'no req body' });
      return
    };
    const { name, email, password, age, bio, socialAccounts, country, profession } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: 'missing fields' });
      return
    }
    const user = await userCollection.findOne({ email: email });
    if (user) {
      res.status(400).json({ message: 'email already registered' });
      return
    }
    const salt = await bcrypt.genSalt(10);  //diff users have diff salt , thus secure 
    const hashedPassword = await bcrypt.hash(password as string, salt);
    const newUser = await userCollection.create({
      name: name,
      email: email,
      password: hashedPassword,
      age: age,
      bio: bio || "",
      socialAccounts: socialAccounts || {},
      country: country || "",
      profession: profession || "",
    });
    const jwt_token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET as string);
    res.cookie('jwt_token',jwt_token,{
      httpOnly:true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    res.status(200).json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        socialAccounts: newUser.socialAccounts,
        country: newUser.country,
        profession: newUser.profession
      }
    });
    return
  } catch (err) {
    console.log('user signup error ', err);
    res.status(500).json({ message: 'internal server error' });
    return
}

}
const login = async (req: Request, res: Response) => {
  const {email,password} = req.body;
  const userInDb = await userCollection.findOne({email:email});
  if(!userInDb){
    res.status(404).json({message:'user does not exist'});
    return
  }
  const correctPassword = await bcrypt.compare(password,userInDb.password as string);
  if(!correctPassword){
    res.status(400).json({message:'wrong password'});
    return
  }
  const jwt_token = jwt.sign({userId:userInDb._id},process.env.JWT_SECRET as string);
  res.cookie('jwt_token',jwt_token,{
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:'strict'
  });
  res.status(200).json({message:'user login successful',user: {
        _id: userInDb._id,
        name: userInDb.name,
        email: userInDb.email,
        bio: userInDb.bio,
        socialAccounts: userInDb.socialAccounts,
        country: userInDb.country,
        profession: userInDb.profession
  }});
  return
}

const logout = async (req: Request, res: Response) => {
  const userInDb = await userCollection.findOne({_id:req.userId});
  if(!userInDb){
    res.status(404).json({message:'user not found'});
    return
  }
  res.clearCookie('jwt_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({message:'user logOut successful'});
  return
}

export { signup, login, logout };
