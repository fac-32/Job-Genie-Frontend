/*
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		open: true, // Opens browser automatically
	},
});* */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		open: true,
	},
	test: {
		environment: 'jsdom',
		setupFiles: './src/components/tests/setup.ts',
	},
});
