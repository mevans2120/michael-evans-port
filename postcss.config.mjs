const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Optimize CSS in production
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
            }],
          },
        }
      : {}),
  },
};

export default config;
