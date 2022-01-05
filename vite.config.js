import path from 'path';
import { defineConfig } from 'vite';

module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/main.ts'),
            name: 'sitemap',
            formats: ['es'],
            fileName: () => `main.mjs`
        }
    }
})
