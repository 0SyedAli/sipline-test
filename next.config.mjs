/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirect to login page by default
  images: {
    domains: ["appsdemo.pro"],

  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/auth/login',
  //       permanent: false,
        
  //     },
  //   ];
  // },
};

export default nextConfig;