import AdminModel from "../models/admin.js";
import Token from "../models/token.js";


const adminAuthHelpers = {
    signUpAdmin:async(email,password)=>{
        const newAdmin = new AdminModel({
            email,
            password
        })
        return await newAdmin.save()
    },
    getAdminByEmail:async(email)=>{
        return await AdminModel.findOne({email},{__v:0,name:0})
    },
    // Do not remove {upsert:true,new:true} from addToken query
    addToken:async(userId,token)=>{
        return await Token.findOneAndUpdate({userId},{$set:{token}},{upsert:true,new:true})
    }
}

export default adminAuthHelpers;