/** TODO [CONFIRM: final admin list]. Comma-separated work UPNs in ADMIN_UPNS. */
export function adminUpns(raw = process.env.ADMIN_UPNS): Set<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.includes("@")),
  );
}

export function normalizeUpn(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function isAllowlistedUpn(value: string | null | undefined, raw = process.env.ADMIN_UPNS): boolean {
  const upn = normalizeUpn(value);
  if (!upn) return false;
  return adminUpns(raw).has(upn);
}

/** Shared by the Entra callback and the email fallback. */
export function adminSignInResult(
  upn: string | null | undefined,
): true | "/admin/not-authorized" {
  return isAllowlistedUpn(upn) ? true : "/admin/not-authorized";
}

export function upnFromEntraProfile(profile: {
  preferred_username?: string | null;
  email?: string | null;
} | null | undefined, fallback?: string | null): string {
  return normalizeUpn(profile?.preferred_username || profile?.email || fallback);
}
