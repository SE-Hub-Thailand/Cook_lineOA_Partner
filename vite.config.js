import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5174, // กำหนดพอร์ตที่ต้องการ
  },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  });

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://cookbstaging.careervio.com',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, '')
//       }
//     }
//   }
// })

// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'
// import fs from 'fs'
// import path from 'path'

// export default defineConfig({
//   server: {
//     https: {
//       key: '/root/Cook_lineOA/key.pem',
//       cert: '/root/Cook_lineOA/cert.pem',
//     },
//     host: true,  // หรือใช้ '--host' ก็ได้
//     port: 5173,  // คุณสามารถเปลี่ยน port ได้ถ้าต้องการ
//   },
//   plugins: [react()],
// })
