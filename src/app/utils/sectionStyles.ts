export const SECTION_STYLES = {
  // The outer section wrapper
  wrapper: "min-h-[100dvh] flex flex-col justify-center pt-24 pb-12 px-8 lg:px-16 border-t border-card-border relative bg-transparent",
  
  // The inner content container limiting max width
  container: "max-w-7xl mx-auto w-full relative z-10",
  
  // The large watermark text placed behind the section title
  backdropWrapper: "absolute top-0 left-0 pointer-events-none select-none z-0 -mt-12 md:-mt-20",
  backdropText: "text-[18vw] md:text-[12vw] font-black font-mono text-foreground/5 tracking-tighter whitespace-nowrap uppercase leading-none",

  // The small "01 --- Section Name" pre-header style
  headerBadgeWrapper: "flex items-center gap-4 font-mono text-sm md:text-lg tracking-[0.2em] text-[#39FF14] dark:text-[#39FF14] mb-6", 
  headerBadgeNumber: "font-bold text-sm md:text-xl",
  headerBadgeLine: "w-10 h-px bg-[#39FF14]/50 dark:bg-[#39FF14]/50",
  headerBadgeText: "text-foreground/50 uppercase font-semibold text-sm md:text-xl",

  // Subtitle (e.g., "Who am I?", "What I Do")
  subtitle: "text-[#39FF14] dark:text-[#39FF14] text-lg md:text-xl font-bold font-sans tracking-wide mb-3",
  
  // The main section title
  title: "text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-foreground leading-tight tracking-tight uppercase",
  
  // Standard text description paragraph
  description: "text-foreground/60 text-sm md:text-md font-light font-inter leading-relaxed max-w-2xl",
};
