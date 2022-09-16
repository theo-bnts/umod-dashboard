/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    domains: ['cdn.discordapp.com'],
  },

  env: {
    DISCORD_API_BASE_URL: process.env.DISCORD_API_BASE_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
    DISCORD_CACHE_EXPIRATION_MINUTES: process.env.DISCORD_CACHE_EXPIRATION_MINUTES,
    
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    
    DATABASE_BOT_HOST: process.env.DATABASE_BOT_HOST,
    DATABASE_BOT_PORT: process.env.DATABASE_BOT_PORT,
    DATABASE_BOT_USER: process.env.DATABASE_BOT_USER,
    DATABASE_BOT_PASSWORD: process.env.DATABASE_BOT_PASSWORD,
    DATABASE_BOT_NAME: process.env.DATABASE_BOT_NAME
  }
}

module.exports = nextConfig
