import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);      // holds all the options for next-auth that are defined in the options.ts file

export { handler as GET, handler as POST };     // here we are exporting the handler as GET and POST so that we can use it in our api route 