import { LINKEDIN_URL } from "@/lib/site";

export function LinkedInFollow({ className }: { className?: string }) {
  return (
    <a
      href={LINKEDIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? "font-medium text-accent hover:underline"}
    >
      Follow us on LinkedIn
    </a>
  );
}
