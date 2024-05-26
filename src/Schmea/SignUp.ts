import {z}from "zod"

export const username = z.string().min(3,"Username must be at least 3 characters long").max(20,"Username must be at most 20 characters long").regex(/^[a-zA-Z0-9]+$/,"Username can only contain letters and numbers").trim()
export const SignUpSchema = 
z.object({
    username:username,
    password:z.string().min(8, "Password must be at least 8 characters long").max(20, "Password must be at most 20 characters long").regex(/^[a-zA-Z0-9]+$/, "Password can only contain letters and numbers").trim(),
    email:z.string().email("Invalid email address").trim(),
    profile_picture:z.object({
        secure_url:z.string().url(),
        public_id:z.string(),
        filename:z.string()
    })
}).refine(data => data.password !== data.username,
    {
        message: "Password must be different from username",
        path: ["password"]
    }
)