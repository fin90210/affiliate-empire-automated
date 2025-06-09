/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental.serverExternalPackages - this was moved to stable in Next.js 15
  // For Next.js 14.2.28, use experimental.serverComponentsExternalPackages instead
  experimental: {
    // Enable App Router if using app directory
    appDir: true,
  
    // For external packages that should not be bundled (Next.js 14.x syntax)
    serverComponentsExternalPackages: [
      '@prisma/client',
      'bcrypt',
      'bcryptjs',
      'jsonwebtoken',
      'plotly.js',
      'mapbox-gl'
    ],
  
    // Cache configuration for better performance
    staleTimes: {
      dynamic: 30,
      static: 180
    }
  },

  // Image domains for external images
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Webpack configuration for better module resolution
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
  
    // Externalize problematic packages for server-side
    if (isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }
  
    return config;
  },

  // Output configuration for better compatibility
  output: 'standalone',

  // Disable strict mode if causing issues
  reactStrictMode: true,

  // Disable SWC minification if causing build issues
  swcMinify: true,

  // Transpile packages that might cause issues
  transpilePackages: [
    'lucide-react',
    '@radix-ui/react-accordion',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-aspect-ratio',
    '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-collapsible',
    '@radix-ui/react-context-menu',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-hover-card',
    '@radix-ui/react-label',
    '@radix-ui/react-menubar',
    '@radix-ui/react-navigation-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-progress',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slider',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
    '@radix-ui/react-toggle',
    '@radix-ui/react-toggle-group',
    '@radix-ui/react-tooltip'
  ]
};

module.exports = nextConfig;
