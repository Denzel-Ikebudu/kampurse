"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function FadeUp({
  children,
  className,
  delay = 0,
}: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroFade({
  children,
  className,
  delay = 0,
}: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroSlide({
  children,
  className,
  delay = 0,
}: MotionProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 40,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.9,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Float({
  children,
  className,
}: Omit<MotionProps, "delay">) {
  return (
    <motion.div
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({
  children,
  className,
}: Omit<MotionProps, "delay">) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverImage({
  children,
  className,
}: Omit<MotionProps, "delay">) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ButtonMotion({
  children,
  className,
}: Omit<MotionProps, "delay">) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionPulse() {
  return (
    <motion.span
      animate={{
        scale: [1, 1.25, 1],
        opacity: [1, 0.7, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="h-2 w-2 rounded-full bg-kampurse-green"
    />
  );
}

export function MotionExplore() {
  return (
    <motion.span
      whileHover={{
        x: 4,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className="mt-5 inline-flex text-sm font-semibold text-kampurse-green-dark"
    >
      Explore
      <span className="ml-1">→</span>
    </motion.span>
  );
}