import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {generateOfflineAssets} from './scripts/offline-build.mjs';
export default defineConfig({
  plugins:[react(),{
    name:'sovereign-offline-bundle',
    apply:'build',
    async closeBundle(){await generateOfflineAssets('dist');}
  }],
  base:'/SovereignBodyMethod/'
});
