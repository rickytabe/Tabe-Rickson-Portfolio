"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "up" | "left" | "right" | "none";
  delay?: number;
  margin?: string;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  margin = "-50px",
  className,
  ...props
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { rootMargin: margin, threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [margin]);

  const baseClass = direction === "up" ? "reveal-up" : direction === "left" ? "reveal-left" : direction === "right" ? "reveal-right" : "";
  const visibleClass = isVisible ? "reveal-visible" : "";

  return (
    <div
      ref={ref}
      className={cn(baseClass, visibleClass, className)}
      style={{ transitionDelay: `${delay}s`, ...props.style }}
      {...props}
    >
      {children}
    </div>
  );
}
