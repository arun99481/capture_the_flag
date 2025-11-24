/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@tartan-ctf/shared"],
    output: "standalone",
};

module.exports = nextConfig;
