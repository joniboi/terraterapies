// next.config.js
module.exports = {
  webpack(config) {
    // Find the existing rule handling images
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // Keep original behavior for SVG imports with ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // New rule: treat other SVGs as React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [/url/] },
        use: ['@svgr/webpack'],
      }
    );

    // Exclude SVGs from the original file loader
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};
