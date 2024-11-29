import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";

const ForecastPage = () => {
    const [productId, setProductId] = useState("");
    const [months, setMonths] = useState("");
    const [forecastMonths, setForecastMonths] = useState("");
    const [forecastData, setForecastData] = useState(null);

    const handleForecast = async () => {
        if (!productId || !months || !forecastMonths) {
            toast.error("Заполните все поля.");
            return;
        }

        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get("http://localhost:8080/api/v1/manager/analyze", {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    productId: parseInt(productId),
                    months: parseInt(months),
                    forecastMonths: parseInt(forecastMonths),
                },
            });
            setForecastData(response.data);
        } catch (error) {
            toast.error("Ошибка при построении прогноза.");
        }
    };

    const chartData = {
        labels: forecastData ? Object.keys(forecastData) : [],
        datasets: [
            {
                label: "Прогноз спроса",
                data: forecastData ? Object.values(forecastData) : [],
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                tension: 0.1,
            },
        ],
    };

    return (
        <div>
            <NavBar/>
            <div>
                <Box sx={{ padding: "16px" }}>
                    <Typography variant="h4" mb={2}>Прогноз спроса</Typography>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="ID продукта"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            type="number"
                            fullWidth
                        />
                        <TextField
                            label="Период (месяцы)"
                            value={months}
                            onChange={(e) => setMonths(e.target.value)}
                            type="number"
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Прогнозный период (месяцы)"
                            value={forecastMonths}
                            onChange={(e) => setForecastMonths(e.target.value)}
                            type="number"
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleForecast}
                            sx={{ mt: 2 }}
                        >
                            Построить прогноз
                        </Button>
                    </Box>
                    {forecastData && (
                        <Box sx={{ mt: 4 }}>
                            <Line data={chartData} />
                        </Box>
                    )}
                </Box>
            </div>
        </div>
    );
};

export default ForecastPage;
