import NextAuth, { AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { UserModel } from './Models/User';
import bcrypt from 'bcryptjs'
import dbConnect from './lib/dbConnect';
import { encode } from 'string-encode-decode';
const credentials = Credentials({
    credentials: {
        identifier: {
            name: 'identifier',
            label: 'Identifier',
            placeholder: 'Identifier',
            type: 'text'
        },
        password: {
            name: 'password',
            label: 'Password',
            placeholder: 'Password',
            type: 'password'
        }
    },
    authorize: async (credentials): Promise<any> =>  {
        if(!credentials) return null
        let query = {}
        if(/@[A-Za-z]{3,}/.test(credentials.identifier as string)) query = {email: credentials.identifier};
        else query = {username: credentials.identifier};
         await dbConnect();
        const user  = await UserModel.findOne(query);
        if(!user) return new Error('Invalid credentials');
         const isMatch =  bcrypt.compareSync(credentials.password as string, user.password);
        if(!isMatch) return new Error('Invalid credentials');
        return user;
}})
export const {handlers:{POST , GET},auth,signIn,signOut ,unstable_update} = NextAuth(
    {
        providers:[credentials],
        pages:{
            signIn: '/auth/Signin',
            signOut: "/", 
        },
        
        callbacks:
        {
            jwt: async ({ token, trigger, session, user }) => {
                if (trigger === 'update') {
                    return {
                       ...token,
                       ...session.user
                     };
                 }
                if (user) {
                  token._id = user._id;
                  token.username = user.username;
                  token.email = user.email;
                  token.profile_picture = user.profile_picture;
                  token.isVerified = user.isVerified;
                  token.verifyCode = btoa(user.verifyCode);
                  token.isVerifyExpire = user.isVerifyExpire;
                  token.isAcceptingMessages = user.isAcceptingMessages;
                }
                return token;
            },
              session: async ({ session, token }) => {
                if (token) {
                  session.user._id = token._id;
                  session.user.username = token.username;
                  session.user.email = token.email;
                  session.user.profile_picture = token.profile_picture;
                  session.user.isVerified = token.isVerified;
                  session.user.verifyCode = token.verifyCode;
                  session.user.verifyExpire = token.verifyExpire;
                  session.user.isAcceptingMessages = token.isAcceptingMessages;
                }
                return session;
              },
        },
        session:
            {
            strategy:'jwt',
            maxAge:30 * 24 * 60 * 60,
            updateAge:15 * 24 * 60 * 60,
            }
    }
)