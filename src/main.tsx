import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useColourToken } from 'themeStyles';

const rootElement = document.getElementById('root')!;
const colourToken = useColourToken();

// Inject global styles using TS
const globalStyles = `
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;
    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: ${colourToken.primary};
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

// Append the styles to the head of the document
const styleTag = document.createElement('style');
styleTag.innerHTML = globalStyles;
document.head.appendChild(styleTag);
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
