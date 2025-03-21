import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // ... existing code ...
  },
  build: {
    commonjsOptions: {
      include: [/neutriumjs\.thermo\.iapws97/]
    }
  }
})
