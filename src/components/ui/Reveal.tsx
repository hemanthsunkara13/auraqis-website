"use client";

import { motion, useInView, type HTMLMotionProps } from "motion/react";
import { useRef } from "react";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number; once?: boolean };

export function Reveal({ delay = 0, y = 28, once = true, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Masked line-by-line headline reveal. Each entry in `lines` is a line; strings or nodes. */
export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h2",
  id,
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
}) {
  // Observe the unclipped heading: the masked inner spans never intersect while translated out.
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={lineClassName ?? "block"}
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 1.1, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
