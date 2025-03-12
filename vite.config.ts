import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	base: process.env.NODE_ENV === 'github' ? '/ShopMyPham_vue/' : '/',
	plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		rollupOptions: {
			input: {
				main: fileURLToPath(new URL('./index.html', import.meta.url)),
			},
		},
	},
});
