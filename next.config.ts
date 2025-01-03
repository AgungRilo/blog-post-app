// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactStrictMode: true,
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    'antd', 
    '@ant-design/icons', 
    '@ant-design/icons-svg', // Modul yang harus ditranspile
    'rc-pagination',
    'rc-util', 
    'rc-picker'], // Tambahkan ini
};

module.exports = nextConfig;