/// <reference types="vite/client" />
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/authContext";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster 
      position="bottom-left" 
      reverseOrder={false} 
      toastOptions={{
        style: {
          background: '#0a0a0a',
          color: '#fff',
          border: '1px solid rgba(34, 197, 94, 0.2)',
        },
      }}
    />
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
      </GoogleOAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);
