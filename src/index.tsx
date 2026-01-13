
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.error("CRITICAL: VITE_GOOGLE_CLIENT_ID is missing in your .env file. Google Authentication will not work. Please add it to your .env file.");
}

root.render(
  <React.StrictMode>
    {/* Use a placeholder if missing to prevent "Uncaught _.Vc" crash, but warn user */}
    <GoogleOAuthProvider clientId={googleClientId || 'missing-client-id-placeholder'}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
