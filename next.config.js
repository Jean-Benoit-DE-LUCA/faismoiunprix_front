/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/assets/images/**'
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/**'
            }
        ]
    }
}
