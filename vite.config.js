import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'VaultPlayer',
            formats: ['es', 'umd'],
            fileName: (format) => {
                if (format === 'es') return 'index.js';
                if (format === 'umd') return 'index.umd.js';
            }
        },
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    // Rename player.css output
                    if (assetInfo.name === 'style.css') return 'player.css';
                    return assetInfo.name;
                }
            }
        },
        cssCodeSplit: false,
        sourcemap: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: false
            }
        }
    }
});
