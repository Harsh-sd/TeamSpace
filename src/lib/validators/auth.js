import {z} from "zod"

//signup validation
export const signupSchema=z.object({
name:z.string().min(2,"Naame is too short"),
email:z.string().email("Invalid email"),
password:z.string().min(5 , "password is too short")
});

//Login validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string() // we can skip min length here
});