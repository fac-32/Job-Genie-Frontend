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
		host: '0.0.0.0',
		port: parseInt(process.env.PORT || '5173', 10),
		open: true,
		allowedHosts: ['job-genie-frontend-i50i.onrender.com', '.onrender.com'],
	},
	test: {
		environment: 'jsdom',
		setupFiles: './src/components/tests/setup.ts',
	},
});
