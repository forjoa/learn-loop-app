// Structural design tokens (shape, type, motion) — not colors.
// Colors stay defined in ./Colors.ts and are untouched by this file.

export const Radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 999,
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const Typography = {
  display: { fontSize: 34, fontWeight: '700' as const, letterSpacing: -0.4, lineHeight: 38 },
  title: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.2, lineHeight: 27 },
  subtitle: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.1, lineHeight: 23 },
  body: { fontSize: 16, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 22 },
  bodyStrong: { fontSize: 16, fontWeight: '600' as const, letterSpacing: 0, lineHeight: 22 },
  small: { fontSize: 14, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 19 },
  label: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 0.4, lineHeight: 15 },
}

export const Motion = {
  // overshootClamping guarantees zero bounce regardless of damping ratio —
  // for press feedback, a bounce reads as a bug, not a delight.
  spring: { damping: 24, stiffness: 300, mass: 0.4, overshootClamping: true },
  springSoft: { damping: 20, stiffness: 140, mass: 0.7 },
  pressScale: 0.96,
  durationFast: 160,
  durationBase: 260,
  durationSlow: 420,
}

export const Elevation = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 14,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
}
