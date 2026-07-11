
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const workerId = "6a52286b0782dff4aa19d227"

export const token = jwt.sign({ workerId }, env.JWT_SECRET, { expiresIn: "7d" });
console.log(token);

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3JrZXJJZCI6IjZhNTIyODZiMDc4MmRmZjRhYTE5ZDIyNyIsImlhdCI6MTc4Mzc5MjA1MSwiZXhwIjoxNzg0Mzk2ODUxfQ.-5x51qVJL7gXOnp5Kg5rXSRj_tCXpmGEA1XwxlrOq-s
