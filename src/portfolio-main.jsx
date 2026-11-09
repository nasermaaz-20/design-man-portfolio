import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PortfolioViewer from './pages/PortfolioViewer';
import './styles/globals.css';
import './styles/portfolio.css';

createRoot(document.getElementById('root')).render(<StrictMode><PortfolioViewer /></StrictMode>);
