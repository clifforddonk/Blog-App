import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "@/models/user";
import db from "@/config/db";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials.email);
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isMatch) throw new Error("Invalid credentials");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        let user = await getUserByEmail(profile.email);

        if (!user) {
          // Create a new user if not found
          const hashedPassword = await bcrypt.hash(profile.sub, 10); // Dummy password
          const userId = await createUser(
            profile.name,
            profile.email,
            hashedPassword,
            "user"
          );

          user = {
            id: userId,
            name: profile.name,
            email: profile.email,
            role: "user",
          };
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login", // Custom sign-in page (optional)
  },
});

// Correctly export GET and POST handlers
export { handler as GET, handler as POST };
