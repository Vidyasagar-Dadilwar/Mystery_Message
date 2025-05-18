import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidationSchema } from "@/schemas/signUpSchema";

 
const UsernameQuerySchema = z.object({
    username: usernameValidationSchema,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryparam = {
            username: searchParams.get("username"),
        }

        // validation with zod
        const result = UsernameQuerySchema.safeParse(queryparam);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                { 
                    success: false,
                    message: (usernameErrors.length > 0) ? usernameErrors.join(',') : "Invalid query parameter"
                }, 
                { status: 400 }
            )
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username: username, 
            isVerified: true
        });

        if(existingVerifiedUser) {
            return Response.json(
                { 
                    success: false,
                    message: "Username already exists" 
                }, 
                { status: 409 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Username is available" 
            }, 
            { status: 200 }
        );

    } catch (error) {
        console.log("Error checking username uniqueness:", error);
        return Response.json(
            { 
                success: false,
                message: "Error checking username uniqueness", 
            }, 
            { status: 500 }
        );         
    }
}