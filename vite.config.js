import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

/**
 * Vite Configuration
 * Cấu hình build tool cho dự án React
 */
export default defineConfig({
  plugins: [react()],
})
