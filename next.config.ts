import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn-avatars.huggingface.co"
            }
        ]
    }
};

export default nextConfig;
