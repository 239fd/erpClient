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
import ProtectedRoute from "./Components/Routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorPage from "./Pages/ErrorPage";
import TakePage from "./Pages/TakePage";
import TakeGoods from "./Pages/Stages/TakeGoods";

function App() {

    return (
        <Router>
            <div>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/home" element={<ProtectedRoute allowedRoles={["ROLE_WORKER", "ROLE_DIRECTOR", "ROLE_ACCOUNTANT", "ROLE_MANAGER"]}><MainPage /></ProtectedRoute>} />
                    <Route path="/take" element={<ProtectedRoute allowedRoles={("ROLE_WORKER")}><TakePage /></ProtectedRoute>} />
                    <Route path="/take/take-goods" element={<ProtectedRoute allowedRoles={("ROLE_WORKER")}><TakeGoods /></ProtectedRoute>} />
                    <Route path="/send" element={<ProtectedRoute allowedRoles={("ROLE_WORKER")}><TakePage /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                    <Route path="/suppliers" element={<ProtectedRoute><SuppliersPage /></ProtectedRoute>} />
                    <Route path="/warehouse" element={<ProtectedRoute><WarehousePage /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                    <Route path="*" element={<ErrorPage/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
