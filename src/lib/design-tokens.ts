export const designTokens = {
  color: {
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    primary: "hsl(var(--primary))",
    border: "hsl(var(--border))",
    muted: "hsl(var(--muted))",
    mutedForeground: "hsl(var(--muted-foreground))",
  },
  radius: {
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)",
    xl: "calc(var(--radius) + 4px)",
  },
  shadow: {
    soft: "var(--shadow-soft)",
    focus: "var(--shadow-focus)",
  },
  motion: {
    duration: {
      fast: "120ms",
      base: "180ms",
      slow: "260ms",
    },
    easing: {
      standard: "cubic-bezier(0.2, 0, 0, 1)",
      emphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },
} as const;
