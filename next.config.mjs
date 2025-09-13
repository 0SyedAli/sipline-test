/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirect to login page by default
  images: {
    domains: ["thesipline.com"],

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