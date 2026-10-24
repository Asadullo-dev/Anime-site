import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      // MUHIM: server/ papkasi (ayniqsa server/uploads/) kuzatuvdan chiqarilgan.
      // Aks holda video fayl yuklanayotganda Vite buni "kod o'zgardi" deb
      // hisoblab, butun sahifani qayta yuklab (HMR reload) yuboradi va
      // video yuklanishini yarim yo'lda to'xtatib qo'yadi.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/server/**'],
      },
    },
  };
});