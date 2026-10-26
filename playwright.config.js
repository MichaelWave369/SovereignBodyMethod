import {defineConfig,devices} from '@playwright/test';

/**
 * Browser smoke suite against a REAL built Vite preview at its GitHub Pages
 * subpath. Not the Vite dev server and not mocked original manuscripts.
 */
export default defineConfig({
 testDir:'./e2e',
 testMatch:'*.spec.js',
 fullyParallel:false,
 forbidOnly:!!process.env.CI,
 retries:process.env.CI?1:0,
 workers:process.env.CI?1:undefined,
 reporter:process.env.CI?[['list'],['html',{open:'never'}]]:'list',
 timeout:45_000,
 expect:{timeout:15_000},
 use:{
  baseURL:'http://127.0.0.1:4173/SovereignBodyMethod/',
  trace:'retain-on-failure',
  screenshot:'only-on-failure',
  video:'retain-on-failure'
 },
 projects:[{name:'chromium-desktop',use:{...devices['Desktop Chrome']}}],
 webServer:{
  command:'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
  url:'http://127.0.0.1:4173/SovereignBodyMethod/',
  reuseExistingServer:!process.env.CI,
  timeout:90_000
 }
});
