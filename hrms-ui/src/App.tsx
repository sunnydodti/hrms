import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { EmployeeList } from './pages/EmployeeList';
import { AddEmployee } from './pages/AddEmployee';
import { Attendance } from './pages/Attendance';
import { ToastProvider } from './context/ToastContext';

function App() {
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
