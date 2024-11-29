import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";
import "../Styles/SuppliersPage.css";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
            const queryParams = new URLSearchParams({
                productId: parseInt(productId),
                months: parseInt(months),
                forecastMonths: parseInt(forecastMonths),
            }).toString();

            const response = await axios.get(
                `http://localhost:8080/api/v1/manager/analyze?${queryParams}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
                setForecastData(response.data); // Сохраняем данные для графика
                toast.success("Прогноз успешно построен!");
            }
        } catch (error) {
            toast.error("Ошибка при построении прогноза.");
            console.error(error);
        }
    };

    const formatChartData = () => {
        if (!forecastData) return null;

        const labels = Object.keys(forecastData).map((date) =>
            new Date(date).toLocaleDateString("ru-RU")
        );
        const data = Object.values(forecastData);

        return {
            labels,
            datasets: [
                {
                    label: "Прогнозируемый спрос",
                    data,
                    fill: false,
                    borderColor: "rgba(75,192,192,1)",
                    tension: 0.1,
                },
            ],
        };
    };

    return (
        <div>
            <NavBar />
            <div className="subMain">
                <Box sx={{ padding: "16px" }}>
                    <Box
                        sx={{
                            height: 500, // Увеличение высоты области
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "16px",
                            mb: 4,
                            display: "flex", // Flexbox для выравнивания
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {forecastData ? (
                            <Line
                                data={formatChartData()}
                                options={{
                                    responsive: true, // График адаптируется под контейнер
                                    maintainAspectRatio: false, // Отключаем фиксированное соотношение сторон
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: "top",
                                        },
                                    },
                                    scales: {
                                        x: {
                                            ticks: {
                                                maxRotation: 45,
                                                minRotation: 45,
                                            },
                                        },
                                        y: {
                                            beginAtZero: true, // Начинаем с нуля
                                        },
                                    },
                                }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                            />
                        ) : (
                            <Typography variant="body1" align="center">
                                График будет отображаться здесь после построения прогноза.
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ mt: 4 }}>
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
                            onClick={handleForecast}
                        >
                            Построить прогноз
                        </Button>
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default ForecastPage;
