"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export function SectionReveal({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      initial={{ y: 20, scale: 0.98 }}
      whileInView={{ y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
