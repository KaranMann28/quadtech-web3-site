import Link from "next/link";

// Auth.js also sends sign-in errors here (pages.error), with ?error=<type>.
const CONFIG_ERRORS = new Set(["Configuration", "OAuthSignin", "OAuthCallbackError", "Callback"]);

export default async function NotAuthorizedPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configError = Boolean(error && CONFIG_ERRORS.has(error));

  return (
    <div className="mx-auto grid max-w-lg gap-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">
        {configError ? "Sign-in failed" : "Access denied"}
      </h1>
      {configError ? (
        <p role="alert">
          Microsoft sign-in could not be completed ({error}). This is a configuration problem on the portal, not
          your account. Ask an owner to check the Auth.js and Entra settings.
        </p>
      ) : (
        <p role="alert">
          This work account is not on the Quad Tech Solutions admin list, so no admin session was created. Ask an
          owner to add it to ADMIN_UPNS if this is a mistake.
        </p>
      )}
      <p>
        <Link href="/admin/signin" className="text-accent">
          Back to sign-in
        </Link>
      </p>
    </div>
  );
}
