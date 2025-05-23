import * as z from "zod";

export const verifySchema = z.object({
    identifier: z.string().min(1, "Username/Email is required"),
    otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
})