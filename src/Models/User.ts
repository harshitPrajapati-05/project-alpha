import mongoose, {Schema } from "mongoose"
const User = new Schema
(
    {
        username: {type: String, required:[true, "Username is required"], unique: true ,match:[ /^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"]},
        email: {type: String, required:[true, "Email is required"], unique: true ,match: [ /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address"]},
        password: {type: String, required:[true, "Password is required"]},
        profile_picture:{
            secure_url: {type: String},
             public_id: {type: String},
             filename: {type: String}
            },
        isVerified: {type: Boolean, default: false},
        verifyCode:{ type: String, requried:[true, "Verify code is required"]},
        isVerifyExpire:{ type: Date, required:[true, "Verify expire is required"]},
        isAcceptingMessage: {type: Boolean, default: false}
    }
)
const db = mongoose.connection.useDb(`project-alpha`)
export const UserModel =  db.models.User || db.model("User", User)