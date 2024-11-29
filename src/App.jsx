import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryPage from './Pages/InventoryPage';
import OrdersPage from './Pages/OrdersPage';
import SuppliersPage from './Pages/SuppliersPage';
import WarehousePage from './Pages/WarehousePage';
import ReportsPage from './Pages/ReportsPage';
import MainPage from "./Pages/MainPage";
import WelcomePage from "./Pages/WelcomePage";
import ProtectedRoute from "./Components/Routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorPage from "./Pages/ErrorPage";
import TakePage from "./Pages/TakePage";
import TakeGoods from "./Pages/Stages/TakeGoods";
import SendPage from "./Pages/SendPage";
import SendGoods from "./Pages/Stages/SendGoods";
import RevaluationPage from "./Pages/RevaluationPage";
import WriteOffPage from "./Pages/WriteOffPage";
import ForecastPage from "./Pages/ForecastPage";

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
                    <Route path="/send" element={<ProtectedRoute allowedRoles={("ROLE_WORKER")}><SendPage /></ProtectedRoute>} />
                    <Route path="/send/send-goods" element={<ProtectedRoute allowedRoles={("ROLE_WORKER")}><SendGoods /></ProtectedRoute>} />

                    <Route path="/writeoff" element={<ProtectedRoute allowedRoles={("ROLE_ACCOUNTANT")}><WriteOffPage /></ProtectedRoute>} />
                    <Route path="/inventory" element={<ProtectedRoute allowedRoles={("ROLE_ACCOUNTANT")}><InventoryPage /></ProtectedRoute>} />
                    <Route path="/revaluation" element={<ProtectedRoute allowedRoles={("ROLE_ACCOUNTANT")}><RevaluationPage /></ProtectedRoute>} />

                    <Route path="/warehouse" element={<ProtectedRoute allowedRoles={("ROLE_DIRECTOR")}> <WarehousePage /></ProtectedRoute>} />
                    <Route path="/report" element={<ProtectedRoute allowedRoles={("ROLE_DIRECTOR")}><ReportsPage /></ProtectedRoute>} />

                    <Route path="/supplier" element={<ProtectedRoute allowedRoles={("ROLE_MANAGER")}><SuppliersPage /></ProtectedRoute>} />
                    <Route path="/order" element={<ProtectedRoute allowedRoles={("ROLE_MANAGER")}><OrdersPage /></ProtectedRoute>} />
                    <Route path="/forecast" element={<ProtectedRoute allowedRoles={("ROLE_MANAGER")}><ForecastPage /></ProtectedRoute>} />

                    <Route path="*" element={<ErrorPage/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
