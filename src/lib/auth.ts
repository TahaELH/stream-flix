// import NextAuth from 'next-auth';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import { db } from '@/lib/db';
// import Google from 'next-auth/providers/google';
// import type { Session } from 'next-auth';
// import type { JWT } from 'next-auth/jwt';

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     uid: string;
//   }
// }

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   adapter: PrismaAdapter(db),
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID! || '',
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET! || '',
//     }),
//   ],
//   callbacks: {
//     session: async ({ session, token }) => {
//       if (session?.user && token?.sub) {
//         session.user.id = token.sub;
//       }
//       return session;
//     },
//     jwt: async ({ user, token }) => {
//       if (user) {
//         token.uid = user.id;
//       }
//       return token;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   pages: {
//     signIn: '/auth/signin',
//     error: '/auth/error',
//   },
// });