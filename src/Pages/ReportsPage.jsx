import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    FormControlLabel,
    Checkbox,
    Button,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";
import { DataGrid } from "@mui/x-data-grid";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportsPage = () => {
    const [warehouseStats, setWarehouseStats] = useState([]);
    const [showChart, setShowChart] = useState(true);
    const [showTable, setShowTable] = useState(true);
    const chartRef = useRef();
    const tableRef = useRef();

    useEffect(() => {
        fetchWarehouseStats();
    }, []);

    const fetchWarehouseStats = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get("http://localhost:8765/warehouse-service/api/statistics/warehouses", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data) {
                const cleanedData = response.data.map(item => {
                    const { warehouseId, ...rest } = item;
                    return rest;
                });
                setWarehouseStats(cleanedData);
            } else {
                toast.error("Ошибка загрузки данных складов.");
            }
        } catch (error) {
            toast.error("Ошибка сервера при загрузке складской статистики.");
        }
    };

    const generatePDF = async () => {
        if (!showChart && !showTable) {
            toast.error("Пожалуйста, выберите хотя бы одну секцию для отчета.");
            return;
        }

        const doc = new jsPDF("p", "mm", "a4");
        let yOffset = 10;

        if (showChart && chartRef.current) {
            const canvas = await html2canvas(chartRef.current);
            const imgData = canvas.toDataURL("image/png");
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth() - 20;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            doc.text("График: Заполненность ячеек", 10, yOffset);
            yOffset += 5;
            doc.addImage(imgData, "PNG", 10, yOffset, pdfWidth, pdfHeight);
            yOffset += pdfHeight + 10;
        }

        if (showTable && tableRef.current) {
            const canvas = await html2canvas(tableRef.current);
            const imgData = canvas.toDataURL("image/png");
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth() - 20;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            doc.text("Информация: Таблица складов", 10, yOffset);
            yOffset += 5;
            doc.addImage(imgData, "PNG", 10, yOffset, pdfWidth, pdfHeight);
        }

        doc.save("warehouse_report.pdf");
    };

    return (
        <div>
            <NavBar />
            <Box sx={{ padding: "16px" }}>
                <Typography variant="h5" mt={4} mb={2}>
                    Заполненность ячеек на складах
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <FormControlLabel
                        control={<Checkbox checked={showChart} onChange={() => setShowChart(!showChart)} />}
                        label="Графика"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={showTable} onChange={() => setShowTable(!showTable)} />}
                        label="Информация"
                    />
                    <Button variant="contained" onClick={generatePDF}>
                        Скачать отчет (PDF)
                    </Button>
                </Box>

                {showChart && (
                    <div ref={chartRef}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={warehouseStats}>
                                <XAxis dataKey="warehouseName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="cellCount" fill="#8884d8" name="Всего ячеек" />
                                <Bar dataKey="filledCellCount" fill="#82ca9d" name="Заполнено" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {showTable && (
                    <Box
                        ref={tableRef}
                        sx={{
                            height: 400,
                            mt: 4,
                            "& .MuiDataGrid-footerContainer": { display: "none" },
                        }}
                    >
                        <DataGrid
                            rows={warehouseStats.map((row, index) => ({ id: index, ...row }))}
                            columns={[
                                { field: "warehouseName", headerName: "Склад", flex: 1 },
                                { field: "rackCount", headerName: "Стеллажи", flex: 1 },
                                { field: "cellCount", headerName: "Ячеек", flex: 1 },
                                { field: "filledCellCount", headerName: "Заполнено", flex: 1 },
                                { field: "productCount", headerName: "Кол-во товаров", flex: 1 },
                                { field: "totalProductValue", headerName: "Общий объем", flex: 1 },
                            ]}
                            pageSize={warehouseStats.length || 5}
                            autoHeight
                        />
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default ReportsPage;
