import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.jsx';
import './app/styles/main.css';
import { I18nProvider } from './shared/i18n/I18nProvider.jsx';
import { ToastProvider } from './shared/ui/toast/ToastProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </I18nProvider>
  </React.StrictMode>
);
