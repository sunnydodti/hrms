import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { EmployeeList } from './pages/EmployeeList';
import { AddEmployee } from './pages/AddEmployee';
import { Attendance } from './pages/Attendance';
import { Welcome } from './pages/Welcome';
import { ToastProvider } from './context/ToastContext';

function App() {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const storedAdmin = localStorage.getItem('hrms_is_admin');
        setIsAdmin(storedAdmin === 'true');
    }, []);

    const handleContinueAsAdmin = () => {
        localStorage.setItem('hrms_is_admin', 'true');
        setIsAdmin(true);
    };

    if (isAdmin === null) return null; // Prevent flicker while loading from storage

    if (!isAdmin) {
        return <Welcome onContinue={handleContinueAsAdmin} />;
    }

    return (
        <ToastProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/employees" element={<EmployeeList />} />
                        <Route path="/employees/add" element={<AddEmployee />} />
                        <Route path="/attendance" element={<Attendance />} />
                    </Routes>
                </Layout>
            </Router>
        </ToastProvider>
    );
}

export default App;
