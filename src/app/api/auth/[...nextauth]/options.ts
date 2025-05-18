import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                email: { label: "Email", type: "text" },         // in backend, this next-auth creates a form with these fields automatically
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                   const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                   })  

                   if(!user) {
                        throw new Error("No user found with this credentials");
                   }

                   if(!user.isVerified) {
                        throw new Error("Please verify your account first");
                   }

                   const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if(!isPasswordCorrect) {
                        throw new Error("Incorrect password");
                    }
                    else{
                        return user;
                    }
                } 
                catch (error: any) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks:{
        // hum idhr try krege ki hum token me maximum data store kre phir vohi data hum session me bhejenge taki in future hamare pass session yaa token me se koi bhi ho to bhi hum data lee sake
        async session({ session, token }) {
            if(token) {
                // here we are adding the user data to the session
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
                session.user.email = token.email;
            }
            return session;
        },
        async jwt({ token, user }) {
            if(user){
                // here we are adding the user data to the token

                // here we cannot directly add the attributes to the token due to type issue to we need to define our own type in types/next-auth.d.ts file where we'll extend the User interface of next-auth and add our own custom fields
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
                token.email = user.email;
            }
            return token;
        },
    },
    pages: {
        signIn: "/sign-in",           // automatically created by next-auth sign-in page and routes accordingly
        error: "/auth/sign-in"
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,        // secret for JWT token
}