import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { QuoteCartProvider } from './context/QuoteCartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <QuoteCartProvider>
      <App />
    </QuoteCartProvider>
  </BrowserRouter>
);