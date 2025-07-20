export const COLORS = {
  // Professional Government Color Scheme
  primary: '#1a365d',        // Deep navy blue - sophisticated
  primaryLight: '#2c5282',   // Medium navy
  primaryDark: '#0f2537',    // Darker navy
  
  // Secondary professional colors
  secondary: '#2b6cb0',      // Royal blue
  secondaryLight: '#4299e1', // Bright blue
  secondaryDark: '#1e4a72',  // Deep blue
  
  // Accent colors for highlights
  accent: '#16a085',         // Professional teal
  accentLight: '#48c9b0',    // Light teal
  accentDark: '#138d75',     // Dark teal
  
  // Health specific colors
  healthGreen: '#27ae60',    // Vibrant medical green
  healthBlue: '#3498db',     // Clean medical blue
  healthTeal: '#1abc9c',     // Fresh teal
  
  // Status colors
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db',
  
  // Neutral palette
  white: '#ffffff',
  black: '#2c3e50',
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Background system
  background: '#f7fafc',     // Soft background
  surface: '#ffffff',        // Card surfaces
  overlay: 'rgba(26, 54, 93, 0.9)', // Dark overlay
  
  // Text hierarchy
  textPrimary: '#2c3e50',    // Main text
  textSecondary: '#34495e',  // Secondary text
  textLight: '#7f8c8d',      // Light text
  textMuted: '#95a5a6',      // Muted text
  
  // Gradient combinations for modern look
  gradients: {
    primary: {
      colors: ['#1a365d', '#2c5282'] as const,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    secondary: {
      colors: ['#2b6cb0', '#4299e1'] as const,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 }
    },
    accent: {
      colors: ['#16a085', '#27ae60'] as const,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    health: {
      colors: ['#1abc9c', '#3498db'] as const,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 }
    },
    warm: {
      colors: ['#e67e22', '#f39c12'] as const,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    cool: {
      colors: ['#2980b9', '#3498db'] as const,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 }
    },
    card: {
      colors: ['#ffffff', '#f8fafc'] as const,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 }
    }
  },
};

export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
