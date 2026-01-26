/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirect to login page by default
  images: {
    domains: ["apiforapp.link"],
    // domains: ["thesipline.com"],
  },

  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/auth/login",
  //       permanent: false, // false = temporary redirect (307)
  //     },
  //   ];
  // },
};

export default nextConfig;