
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      username: string;
      email: string;
      profile_picture?: {
        secure_url: string;
        public_id: string;
        filename: string;
      };
      isVerified: boolean;
      verifyCode: string;
      verifyExpire: Date;
      isAcceptingMessages: boolean;
      isSignedIn: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    username: string;
    email: string;
    profile_picture?: {
      secure_url: string;
      public_id: string;
      filename: string;
    };
    isVerified: boolean;
    verifyCode: string;
    verifyExpire: Date;
    isSignedIn: boolean;
    isAcceptingMessages: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    username: string;
    email: string;
    profile_picture?: {
      secure_url: string;
      public_id: string;
      filename: string;
    };
    isVerified: boolean;
    verifyCode: string;
    verifyExpire: Date;
    isAcceptingMessages: boolean;
    isSignedIn: boolean;
  }
}
