import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { findAdminByEmail } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) {
          return null;
        }

        const admin = findAdminByEmail(email);
        if (!admin) {
          return null;
        }

        const valid = await bcrypt.compare(password, admin.password_hash);
        if (!valid) {
          return null;
        }

        return {
          id: String(admin.id),
          email: admin.email,
          name: admin.name || "Admin",
        };
      },
    }),
  ],
});
