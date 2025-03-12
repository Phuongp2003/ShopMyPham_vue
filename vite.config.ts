import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
	base: process.env.NODE_ENV === 'github' ? '/ShopMyPham_vue/' : '/',
	plugins: [
		vue(),
		vueJsx(),
		vueDevTools(),
		tailwindcss(),
		viteStaticCopy({
			targets: [
				{ src: 'index.html', dest: '' }, // Giữ index.html
				{ src: 'index.html', dest: 'login' },
				{ src: 'index.html', dest: 'orders' },
				{ src: 'index.html', dest: 'review' },
				{ src: 'index.html', dest: 'about' },
				{ src: 'index.html', dest: '404' },
			],
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		rollupOptions: {
			input: {
				index: 'index.html', // Trang chính
				login: 'index.html',
				orders: 'index.html',
				review: 'index.html',
				about: 'index.html',
				'404': 'index.html',
			},
			output: {
				entryFileNames: '[name].js',
			},
		},
	},
});
