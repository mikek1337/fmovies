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
                }
            ]
        }
    
};

export default nextConfig;
