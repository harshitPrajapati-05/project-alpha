import { z } from "zod";
import { username } from "./SignUp";


export const SignInSchema = z.object({
        email: z.string().email("Invalid email address").trim().optional(),
        username: username.optional(),
    password: z.string().min(8, "Password must be at least 8 characters long")
})