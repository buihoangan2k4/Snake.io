import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

// Kiểm tra rootElement để đảm bảo không bị lỗi null khi sử dụng TypeScript
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Please check your HTML structure.");
}

