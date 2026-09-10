module.exports = ({ config }) => ({
  ...config,
  web: { ...config.web, output: 'static' },
  experiments: {
    ...config.experiments,
    ...(process.env.GITHUB_PAGES === 'true'
      ? { baseUrl: '/anestesiahelppi' }
      : {}),
  },
});
