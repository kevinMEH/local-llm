import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn-avatars.huggingface.co"
            }, {
                protocol: "https",
                hostname: "www.gravatar.com"
            }
        ]
    }
};

export default nextConfig;
