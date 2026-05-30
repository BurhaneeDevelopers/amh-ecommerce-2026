import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'A.M. Hydraulics & Tubes',
    short_name: 'AM Hydraulics',
    description: 'ISO certified manufacturer and authorized distributor of hydraulic hoses, fittings, pumps, valves, and pneumatic components in Chennai, India',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ff6b35',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['business', 'shopping'],
    lang: 'en-IN',
  };
}
