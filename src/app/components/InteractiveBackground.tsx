"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { DotField } from "@/components/ui/dot-field";
import { ClickSpark } from "@/components/ui/click-spark";

export function InteractiveBackground({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || theme !== "light";

  // Dynamic colors for the background elements based on theme
  const dotGradientFrom = isDark ? "rgba(57, 255, 20, 0.2)" : "rgba(22, 163, 74, 0.45)";
  const dotGradientTo = isDark ? "rgba(57, 255, 20, 0.1)" : "rgba(22, 163, 74, 0.25)";
  const dotGlowColor = isDark ? "rgba(57, 255, 20, 0.08)" : "rgba(22, 163, 74, 0.15)";
  const sparkColor = isDark ? "#39FF14" : "#16a34a";

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "var(--background)", transition: "background-color 0.3s ease" }}>
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom={dotGradientFrom}
          gradientTo={dotGradientTo}
          glowColor={dotGlowColor}
        />
      </div>

      <ClickSpark sparkColor={sparkColor} sparkSize={12} sparkRadius={20} sparkCount={8} duration={400}>
        {children}
      </ClickSpark>
    </>
  );
}
