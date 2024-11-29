import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";

const OrdersPage = () => {
    const [productId, setProductId] = useState("");
    const [months, setMonths] = useState("");
    const [forecastMonths, setForecastMonths] = useState("");

    const handleCreateOrder = async () => {
        if (!productId || !months || !forecastMonths) {
            toast.error("Заполните все поля.");
            return;
        }

        try {
            const token = localStorage.getItem("jwtToken");
            await axios.post(
                "http://localhost:8080/api/v1/manager/order",
                {
                    productId: parseInt(productId),
                    months: parseInt(months),
                    forecastMonths: parseInt(forecastMonths),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Заказ успешно создан!");
        } catch (error) {
            toast.error("Ошибка при создании заказа.");
        }
    };

    return (
        <div>
            <NavBar/>
            <div>
                <Box sx={{ padding: "16px" }}>
                    <Typography variant="h4" mb={2}>Создание заказа</Typography>
                    <TextField
                        label="ID продукта"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        type="number"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Период (месяцы)"
                        value={months}
                        onChange={(e) => setMonths(e.target.value)}
                        type="number"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Прогнозный период (месяцы)"
                        value={forecastMonths}
                        onChange={(e) => setForecastMonths(e.target.value)}
                        type="number"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateOrder}
                    >
                        Создать заказ
                    </Button>
                </Box>
            </div>
        </div>

    );
};

export default OrdersPage;
