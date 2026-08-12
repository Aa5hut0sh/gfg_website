import { populate } from "dotenv";
import Application from "../models/Application.model";
import User from "../models/User.model";


export const createApplication = async (userId :string , body:{MobileNo:string , preference1 :string , preference2:string , preference3:string ,reason:string , skills:string[] , OtherClubs:string[]} )=>{
    const user = await User.findById(userId);
    const rollNo = user?.email.substring(0,8);
    const form = await Application.create({
          user: userId,
          rollNo,
          ...body,
    });

    return form;
};

export const getexistingApplication = async(userId:string) =>{
    return  await Application.findOne({ user: userId });
}


export const allApplication = async()=>{
    return await Application.find().populate('user');
}

export const deleteForm = async(userId:string)=>{
    await Application.deleteMany({user:userId})
}
