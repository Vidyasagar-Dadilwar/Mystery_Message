import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const data = await request.json();
        const identifier = data.identifier;
        const code = data.otp;
        const decodedIdentifier = decodeURIComponent(identifier);

        // Try to find user by either username or email
        const user = await UserModel.findOne({
            $or: [
                { username: decodedIdentifier },
                { email: decodedIdentifier }
            ]
        });

        if (!user) {
            console.log("User not found for identifier:", decodedIdentifier);
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        }

        console.log("Verification attempt:", {
            identifier: decodedIdentifier,
            providedCode: code,
            storedCode: user.verifyCode,
            codeExpiry: user.verifyCodeExpiry,
            isCodeValid: user.verifyCode === code,
            isCodeNotExpired: new Date(user.verifyCodeExpiry) > new Date()
        });

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "User verified successfully"
                },
                { status: 200 }
            );
        }

        if (!isCodeValid) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code"
                },
                { status: 400 }
            );
        }

        if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code expired"
                },
                { status: 400 }
            );
        }

        // This should never happen due to the conditions above, but just in case
        return Response.json(
            {
                success: false,
                message: "Verification failed"
            },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error verifying user:", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user",
            },
            { status: 500 }
        );
    }
}