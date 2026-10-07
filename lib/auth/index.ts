import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrisma } from "@/lib/db";
import { adminSignInResult, upnFromEntraProfile } from "@/lib/auth/allowlist";
import { sendAdminMagicLink } from "@/lib/auth/magic-link";
import { safeAuthRedirect } from "@/lib/auth/redirect";

export function authMode(): "entra" | "email" {
  return process.env.AUTH_PROVIDER === "email" ? "email" : "entra";
}

export function entraConfigured(): boolean {
  return Boolean(
    process.env.AUTH_MICROSOFT_ENTRA_ID_ID?.trim() &&
      process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET?.trim() &&
      process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID?.trim(),
  );
}

function entraIssuer(): string {
  const explicit = process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const tenant = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID?.trim();
  if (!tenant) return "https://login.microsoftonline.com/common/v2.0";
  return `https://login.microsoftonline.com/${tenant}/v2.0`;
}

function providers() {
  if (authMode() === "email") {
    return [
      Nodemailer({
        server: { host: "127.0.0.1", port: 25, auth: { user: "unused", pass: "unused" } },
        from: process.env.APPLY_SMTP_FROM?.trim() || "Quad Tech Solutions <no-reply@localhost>",
        maxAge: 60 * 30,
        sendVerificationRequest: async ({ identifier, url }) => {
          await sendAdminMagicLink(identifier, url);
        },
      }),
    ];
  }

  const entra = MicrosoftEntraID({
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID?.trim() || "not-configured",
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET?.trim() || "not-configured",
    issuer: entraIssuer(),
  });
  entra.profile = (profile) => {
    const record = profile as { sub?: string; name?: string; email?: string; preferred_username?: string };
    return {
      id: record.sub,
      name: record.name,
      email: upnFromEntraProfile(record),
      image: null,
    };
  };
  return [entra];
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(getPrisma()),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/signin",
    verifyRequest: "/admin/signin",
    error: "/admin/not-authorized",
  },
  providers: providers(),
  callbacks: {
    async redirect({ url, baseUrl }) {
      return safeAuthRedirect(url, baseUrl);
    },
    async signIn({ user, profile, account }) {
      const upn =
        account?.provider === "microsoft-entra-id"
          ? upnFromEntraProfile(
              profile as { preferred_username?: string; email?: string },
              user.email,
            )
          : user.email;
      return adminSignInResult(upn);
    },
    async jwt({ token, user, profile, account }) {
      if (account?.provider === "microsoft-entra-id") {
        const upn = upnFromEntraProfile(
          profile as { preferred_username?: string; email?: string },
          user?.email,
        );
        if (upn) token.email = upn;
      } else if (user?.email) {
        token.email = user.email.toLowerCase();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.email === "string") {
        session.user.email = token.email;
      }
      return session;
    },
  },
});
