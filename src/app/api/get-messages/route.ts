import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request){
    await dbConnect();

    // Used to get the sessoion
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !session.user) {
        return Response.json(
            { 
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        );
    }

    // converting the user id to a mongoose object id from string due to aggregate pipeline
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user =  await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: "$messages"      // create a new document for each message
            },
            {
               $sort: {
                    "messages.createdAt": -1 // sort the messages by createdAt in descending order
               }
            },
            {
                $group: {
                    _id: "$_id", // group by user id
                    messages: {
                        $push: "$messages" // push the messages into an array
                    }
                }
            }
        ])

        if(!user || user.length === 0) {
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
                messages: user[0].messages
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error getting messages:", error);
        return Response.json(
            { 
                success: false,
                message: "Error getting messages"
            },
            { status: 500 }
        )
    }
}