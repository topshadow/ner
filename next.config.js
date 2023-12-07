/** @type {import('next').NextConfig} */
const nextConfig = {

    typescript: {
        ignoreBuildErrors: true,
    },
    poweredByHeader:false,
    images:{
        remotePatterns:[
            {
                hostname:'47.96.103.119',
                protocol:'http'
            }
        ]
    },
    experimental:{
        serverActions:{
            allowedOrigins:['47.96.103.119']
        }
    }
        
    
}

module.exports = nextConfig
