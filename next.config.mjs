/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/tools/hireassist-alpha",
        destination: "/jobs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
