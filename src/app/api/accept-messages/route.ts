import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request){
    await dbConnect();

    // Used to get the sessoion 
    const session = await getServerSession(authOptions);
    const user:User = session?.user;

    if(!session || !session.user) {
        return Response.json(
            { 
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        );
    }


    const userId = user._id;
    const {acceptMessages} = await request.json();



    try{
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, // used to find the user by id
            { isAcceptingMessages: acceptMessages },  // updates the status of accepting messages
            { new: true }
        )

        if(!updatedUser){
            return Response.json(
                { 
                    success: false,
                    message: "Error accepting messages"
                },
                { status: 500 }
            );
        }
        return Response.json(
            { 
                success: true,
                message: "Sucessfully updated the status of accepting messages",
                updatedUser 
            },
            { status: 200 }
        );
    }
    catch(error){
        console.log("Failed to update the status to accept messages :", error);
        return Response.json(
            { 
                success: false,
                message: "Error accepting messages"
            },
            { status: 500 }
        );
    }
}


export async function GET(request: Request){
    await dbConnect();

    // Used to get the sessoion 
    const session = await getServerSession(authOptions);
    const user:User = session?.user;

    if(!session || !session.user) {
        return Response.json(
            { 
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        );
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json(
                { 
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
                userId: foundUser._id,
                message: "Successfully fetched the status of accepting messages",
            }
        )
    } catch (error) {
        console.log("Failed to get the status of accept messages :", error);
        return Response.json(
            { 
                success: false,
                message: "Error in getting accepting messages status"
            },
            { status: 500 }
        );
    }
}
