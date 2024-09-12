/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
            remotePatterns:[
                {
                    protocol: "https",
                    hostname:"api.themoviedb.org",

                }
            ]
        }
    
};

export default nextConfig;
