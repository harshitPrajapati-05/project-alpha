import { z } from "zod";
import { username } from "./SignUp";


export const sendMessage = z.object({
    content:z.string(),
    createdAt:z.date(),
    username:username,
    sender:username,
    }
)