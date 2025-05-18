import "next-auth";


// here we are extending the User interface of next-auth to add our own custom fields
declare module "next-auth" {
    interface User{
        _id?: string;
        username?: string;
        email?: string;
        password?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        messages?: Array<any>;
    }
    interface Session {
        user?:{
            _id?: string;
            username?: string;
            email?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
        } & DefaultSession["user"];
    }
    interface JWT {
        _id?: string;
        username?: string;
        email?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
}