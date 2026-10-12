import { redirect } from "next/navigation";
import { isAllowlistedUpn } from "@/lib/auth/allowlist";
import { auth, authMode, entraConfigured, signIn } from "@/lib/auth";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ check?: string; error?: string; provider?: string }>;
}) {
  const session = await auth();
  const sessionEmail = session?.user?.email ?? "";
  if (sessionEmail) {
    // Signed in but not on ADMIN_UPNS: show access denied instead of the sign-in form.
    redirect(isAllowlistedUpn(sessionEmail) ? "/admin" : "/admin/not-authorized");
  }
  const query = await searchParams;
  const mode = authMode();
  const emailSent = query.check === "email" || query.provider === "nodemailer";

  return (
    <div className="mx-auto grid max-w-lg gap-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Admin sign-in</h1>
      <p className="text-sm text-muted-foreground">
        Quad administrators sign in with a Microsoft work account. The account must be on the admin list.
      </p>
      {emailSent ? (
        <p className="rounded-lg border border-border bg-card p-3 text-sm" role="status">
          Check your email for a sign-in link.
        </p>
      ) : null}
      {query.error === "entra" ? (
        <p className="text-sm text-destructive" role="alert">
          Microsoft sign-in is not configured yet. TODO [CONFIRM: app registration created by admin].
        </p>
      ) : null}
      {mode === "entra" ? (
        entraConfigured() ? (
          <form
            action={async () => {
              "use server";
              await signIn("microsoft-entra-id", { redirectTo: "/admin" });
            }}
          >
            <button type="submit" className="h-11 rounded-lg bg-primary px-4 text-sm text-primary-foreground">
              Sign in with Microsoft
            </button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            Microsoft Entra ID is the sign-in method, and the app registration is not in place yet. See
            docs/admin-auth-setup.md. TODO [CONFIRM: app registration created by admin].
          </p>
        )
      ) : (
        <form
          className="grid gap-3"
          action={async (formData) => {
            "use server";
            const email = String(formData.get("email") ?? "");
            if (!isAllowlistedUpn(email)) redirect("/admin/not-authorized");
            await signIn("nodemailer", { email, redirectTo: "/admin" });
          }}
        >
          <label className="grid gap-2 text-sm" htmlFor="email">
            Work email
            <input id="email" name="email" type="email" required autoComplete="username" className="h-11 rounded-lg border border-border bg-background px-3" />
          </label>
          <button type="submit" className="h-11 w-fit rounded-lg bg-primary px-4 text-sm text-primary-foreground">
            Email me a sign-in link
          </button>
          <p className="text-sm text-muted-foreground">
            Email sign-in is the fallback while Entra registration is unfinished. It uses the same admin list.
          </p>
        </form>
      )}
    </div>
  );
}
