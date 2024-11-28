import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './Pages/DashboardPage';
import InventoryPage from './Pages/InventoryPage';
import OrdersPage from './Pages/OrdersPage';
import SuppliersPage from './Pages/SuppliersPage';
import WarehousePage from './Pages/WarehousePage';
import ReportsPage from './Pages/ReportsPage';
import SettingsPage from './Pages/SettingsPage';
import MainPage from "./Pages/MainPage";
import WelcomePage from "./Pages/WelcomePage";
import ProtectedRoute from "./Components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <Router>
            <div>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/" element={<WelcomePage />} />

                    <Route path="/home" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                    <Route path="/suppliers" element={<ProtectedRoute><SuppliersPage /></ProtectedRoute>} />
                    <Route path="/warehouse" element={<ProtectedRoute><WarehousePage /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                    <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
