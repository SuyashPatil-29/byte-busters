/** @type {import('next').NextConfig} */
const nextConfig = {  
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "images.unsplash.com",
    ],
  },
    webpack: (
      config,
      { buildId, dev, isServer, defaultLoaders, webpack }
    ) => {
      config.resolve.alias.canvas = false
      config.resolve.alias.encoding = false
      return config
    },
  }
  
  module.exports = nextConfig