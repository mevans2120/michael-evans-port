const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Enhanced CSS optimization for production (Phase 1.2)
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: ['advanced', {
              discardComments: { removeAll: true },
              reduceIdents: false, // Preserve CSS variable names for theming
              zindex: false, // Don't optimize z-index (breaks layering)
              normalizeWhitespace: true,
              colormin: true,
              minifyFontValues: true,
              minifySelectors: true,
              mergeLonghand: true,
              mergeRules: true,
            }],
          },
        }
      : {}),
  },
};

export default config;
