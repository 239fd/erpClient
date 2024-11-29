import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";
import { DataGrid } from "@mui/x-data-grid";

const DashboardPage = () => {
    const [transactionSummary, setTransactionSummary] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTransactionSummary();
    }, []);

    const fetchTransactionSummary = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get("http://localhost:8080/api/v1/director/transactions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data) {
                setTransactionSummary(response.data);
            } else {
                toast.error("Ошибка загрузки данных транзакций.");
            }
        } catch (error) {
            toast.error("Ошибка сервера при загрузке данных.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatTransactionData = () => {
        const rows = [];
        Object.entries(transactionSummary).forEach(([category, details], index) => {
            Object.entries(details).forEach(([subCategory, value]) => {
                rows.push({
                    id: `${category}-${subCategory}-${index}`,
                    category,
                    subCategory,
                    value,
                });
            });
        });
        return rows;
    };

    const transactionColumns = [
        { field: "category", headerName: "Категория", flex: 1 },
        { field: "subCategory", headerName: "Подкатегория", flex: 1 },
        { field: "value", headerName: "Значение", flex: 0.5 },
    ];

    const rows = formatTransactionData();

    return (
        <div>
            <NavBar />
            <Box sx={{ padding: "16px" }}>
                <Typography variant="h4" mb={4}>
                    Обзор транзакций
                </Typography>
                {isLoading ? (
                    <Typography>Загрузка...</Typography>
                ) : (
                    <>
                        <Grid container spacing={2} mb={4}>
                            {Object.entries(transactionSummary).map(([category, details]) => (
                                <Grid item xs={12} md={4} key={category}>
                                    <Paper sx={{ padding: "16px", height: "100%" }}>
                                        <Typography variant="h6" gutterBottom>
                                            {category}
                                        </Typography>
                                        <Box>
                                            {Object.entries(details).map(([subCategory, value]) => (
                                                <Typography key={subCategory}>
                                                    {subCategory}: {value}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ height: 400 }}>
                            <DataGrid
                                rows={rows}
                                columns={transactionColumns}
                                pageSize={5}
                                rowsPerPageOptions={[5, 10]}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </div>
    );
};

export default DashboardPage;
