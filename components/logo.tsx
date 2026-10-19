import Image from "next/image";
import { LOGO_SRC } from "@/lib/site";

export function Logo({
  className = "size-8",
  preload = false,
}: {
  className?: string;
  preload?: boolean;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt=""
      width={32}
      height={32}
      className={className}
      aria-hidden="true"
      preload={preload}
    />
  );
}
