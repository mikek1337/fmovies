/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol: "https",
                hostname:"api.themoviedb.org",
            },
            {
                protocol: "https",
                hostname: "image.tmdb.org"
            }
        ]
    },
    async redirects() {
        return [
            {
                source: '/login',
                destination: '/signin',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
