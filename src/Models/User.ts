import mongoose, {Schema } from "mongoose"

export interface Message extends Document {
    content: string;
    createdAt: Date;
  }
  
const MessageSchema: Schema<Message> = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  });
  
  export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyExpire: Date; 
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
    profile_picture: {
      secure_url: string;
      public_id: string;
      filename: string;
    };
  }
  
const User: Schema<User> = new Schema
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
        verifyExpire:{ type: Date, required:[true, "Verify expire is required"]},
        isAcceptingMessages: {type: Boolean, default: false},
        messages: [MessageSchema],
    }
)
const db = mongoose.connection.useDb(`project-alpha`)
export const UserModel =  db.models.User || db.model("User", User)