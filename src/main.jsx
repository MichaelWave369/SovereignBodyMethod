import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import {registerOfflineWorker} from './offlineClient.js';
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);

registerOfflineWorker().catch(error=>console.warn('Offline setup:',error.message));
