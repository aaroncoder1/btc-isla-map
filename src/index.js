import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Optional: Include your CSS
import App from './components/map'; // Update path as needed
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Log performance metrics
reportWebVitals(console.log);
