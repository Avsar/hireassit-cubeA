export default {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/tools/hireassist-alpha",
        destination: "/tools/ai-match",
        permanent: true,
      },
    ];
  },
};
