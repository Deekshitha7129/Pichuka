import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';
import { createStyleImportPlugin, AndDesignVueResolve } from 'vite-plugin-style-import';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  const isProduction = mode === 'production';
  
  return {
    base: '/', // Set your base URL here if deploying to a subdirectory
    plugins: [
      react(),
      // Add PWA support
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Pichuka Restaurant',
          short_name: 'Pichuka',
          description: 'Pichuka Multi-Cuisine Restaurant Booking System',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      // HTML minification and variable injection
      createHtmlPlugin({
        minify: isProduction,
        inject: {
          data: {
            title: env.VITE_APP_TITLE || 'Pichuka Restaurant',
            description: env.VITE_APP_DESCRIPTION || 'Multi-Cuisine Restaurant Booking System',
          },
        },
      }),
      // Bundle analyzer (only in report mode)
      mode === 'report' && visualizer({
        open: true,
        filename: 'bundle-analyzer-report.html',
        gzipSize: true,
        brotliSize: true,
      }),
      // Auto import styles for antd
      createStyleImportPlugin({
        resolves: [AndDesignVueResolve()],
      }),
    ].filter(Boolean),
    
    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isProduction ? 'hidden' : true,
      minify: isProduction ? 'terser' : 'esbuild',
      cssCodeSplit: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['axios', 'react-hot-toast'],
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
    },
    
    // Server configuration
    server: {
      port: 5173,
      strictPort: true,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@pages': resolve(__dirname, './src/pages'),
        '@assets': resolve(__dirname, './src/assets'),
        '@utils': resolve(__dirname, './src/utils'),
        '@hooks': resolve(__dirname, './src/hooks'),
        '@services': resolve(__dirname, './src/services'),
      },
    },
    
    // CSS configuration
    css: {
      devSourcemap: !isProduction,
      modules: {
        generateScopedName: isProduction 
          ? '[hash:base64:5]' 
          : '[path][name]__[local]',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'axios'],
      exclude: ['@babel/plugin-transform-runtime'],
    },
  };
});
