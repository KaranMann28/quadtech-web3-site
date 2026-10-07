import Link from "next/link";

export default function NotAuthorizedPage() {
  return (
    <div className="mx-auto grid max-w-lg gap-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Not an admin</h1>
      <p>
        This work email is not on the Quad Tech Solutions admin list, so no admin session was created. Ask an
        owner to add it to ADMIN_UPNS if this is a mistake.
      </p>
      <p>
        <Link href="/admin/signin" className="text-accent">
          Back to sign-in
        </Link>
      </p>
    </div>
  );
}
