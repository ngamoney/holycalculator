/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.8'],
  async redirects() {
    return [
      {
        source: '/spiritual/life-path-calculator',
        destination: '/spiritual/life-path-number-calculator',
        permanent: true,
      },
      {
        source: '/spiritual/zodiac-calculator',
        destination: '/spiritual/zodiac-compatibility-calculator',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
