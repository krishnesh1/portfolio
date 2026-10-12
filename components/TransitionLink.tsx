"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/transition/TransitionProvider";
import { scrollToTarget } from "@/lib/lenis";

type Props = React.ComponentProps<typeof Link> & { onNavigate?: () => void };

/**
 * Drop-in <Link>:
 *  - "#hash" links on the home page → Lenis smooth scroll
 *  - "/route" links                 → black curtain transition, then push
 */
export default function TransitionLink({ href, onClick, onNavigate, children, ...rest }: Props) {
  const { navigate } = usePageTransition();
  const pathname = usePathname();
  const to = typeof href === "string" ? href : href.pathname ?? "/";

  const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate?.();

    if (to.startsWith("#")) {
      if (pathname === "/") scrollToTarget(to);
      else navigate("/" + to);
      return;
    }
    navigate(to);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
