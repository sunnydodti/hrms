import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ToastProvider } from './context/ToastContext';

function App() {
    return (
        <ToastProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                    </Routes>
                </Layout>
            </Router>
        </ToastProvider>
    );
}

export default App;
