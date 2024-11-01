/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
            remotePatterns:[
                {
                    protocol: "https",
                    hostname:"api.themoviedb.org",

                },
                {
                    protocol: "http",
                    hostname: "image.tmdb.org"
                },
                {
                    protocol: "https",
                    hostname: "sea1.ingest.uploadthing.com"
                }
            ]
        }
    
};

export default nextConfig;
