"use client";

import { useRef, type ElementType } from "react";
import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  text: string;
  /** The element to render, e.g. "h3" for a heading. Defaults to "p". */
  as?: ElementType;
  className?: string;
}

/** How bright a word is before the scroll reaches it: dim, but always readable. */
const REST_OPACITY = 0.25;

/**
 * Words light up one by one as the reader scrolls, tied directly to the scroll
 * (no autoplay, no loop). The reveal starts when the text enters the lower part of
 * the screen and is complete by the time it reaches the middle. Screen readers get
 * the sentence once; with reduced motion every word is fully lit (see globals.css).
 */
function TextRevealByWord({ text, as: Tag = "p", className }: TextRevealByWordProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center 50%"],
  });
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={cn("reveal-text", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
              {word}
              {i < words.length - 1 ? " " : ""}
            </Word>
          );
        })}
      </span>
    </Tag>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [REST_OPACITY, 1]);
  return (
    <motion.span className="reveal-word" style={{ opacity }}>
      {children}
    </motion.span>
  );
}

export { TextRevealByWord };
