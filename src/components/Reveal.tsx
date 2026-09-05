import type { ReactNode } from "react";
import { useInViewOnce } from "../lib/hooks";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

/** Membungkus konten agar muncul halus saat digulir ke viewport. */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealProps) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const dirClass =
    direction === "left"
      ? "reveal-left"
      : direction === "right"
        ? "reveal-right"
        : "";
  return (
    <div
      ref={ref}
      className={`reveal ${dirClass} ${inView ? "in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
