/** @type {import('next').NextConfig} */
const nextConfig =  {
  /* config options here */
  reactCompiler: true,
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },{
       protocol: 'https',
      hostname: 'lh3.googleusercontent.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      port: '',
      pathname: '/**',
    },
     
    
    ]
  }
};

export default nextConfig;
