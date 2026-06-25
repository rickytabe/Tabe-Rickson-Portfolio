"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  text: React.ReactNode;
  textClassName?: string;
  underlineClassName?: string;
  underlinePath?: string;
  underlineHoverPath?: string;
  underlineDuration?: number;
  as?: React.ElementType;
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      textClassName,
      underlineClassName,
      underlinePath = "M 0,10 Q 75,0 150,10 Q 225,20 300,10",
      underlineHoverPath = "M 0,10 Q 75,20 150,10 Q 225,0 300,10",
      underlineDuration = 1.5,
      as: Component = "span",
      ...props
    },
    ref
  ) => {
    const pathVariants: Variants = {
      hidden: {
        pathLength: 0,
        opacity: 0,
      },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: underlineDuration,
          ease: "easeInOut",
        },
      },
    };

    // Use a custom motion component based on the 'as' prop
    const MotionComponent = motion(Component as any);

    return (
      <div
        ref={ref}
        className={cn("inline-flex flex-col items-center justify-center gap-1", props.className)}
      >
        <div className="relative inline-block">
          <MotionComponent
            className={cn("relative z-10", textClassName)}
            initial={{ y: -5, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            {text}
          </MotionComponent>

          <motion.svg
            width="100%"
            height="12"
            viewBox="0 0 300 20"
            preserveAspectRatio="none"
            className={cn("absolute -bottom-1 left-0 z-0", underlineClassName)}
          >
            <motion.path
              d={underlinePath}
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{
                d: underlineHoverPath,
                transition: { duration: 0.8 },
              }}
            />
          </motion.svg>
        </div>
      </div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
