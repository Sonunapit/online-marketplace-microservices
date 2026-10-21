
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        id: '/',
        name: 'Vibrant Marketplace',
        short_name: 'Marketplace',
        description: 'Shop online with Vibrant Marketplace',
        theme_color: '#111827',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',

        icons: [
          {
            src: '/Vibrant Marketplace Cart Icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/Vibrant Shopping Cart App Icon apple.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
