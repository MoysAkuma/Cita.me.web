import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

function AppContent(): React.JSX.Element {
  
  return (<></>);
}

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#f0f2f5',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          flexGrow: 1
        }}>
          <AppContent />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
