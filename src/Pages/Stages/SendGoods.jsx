import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NavBar from "../../Components/NavBar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SendGoods = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState({ id: "", amount: "" });
    const [deliveryInfo, setDeliveryInfo] = useState({
        vehicle: "",
        driverName: "",
        deliveryAddress: "",
        organizationName: "",
        organizationAddress: "",
        customerName: "",
        customerAddress: "",
        documentNumber: "",
        documentDate: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleAddProduct = () => {
        if (currentProduct.id && currentProduct.amount) {
            setSelectedProducts((prev) => [...prev, currentProduct]);
            setCurrentProduct({ id: "", amount: "" });
        }
    };

    const handleRemoveProduct = (indexToRemove) => {
        setSelectedProducts((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("jwtToken");

            const requestBody = {
                productIds: selectedProducts.map((product) => Number(product.id)),
                amounts: selectedProducts.map((product) => Number(product.amount)),
                ...deliveryInfo,
            };

            const response = await axios.post(
                "http://localhost:8080/api/v1/worker/dispatch",
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], { type: "application/zip" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "dispatch_documents.zip";
            link.click();

            toast.success("Товары успешно отправлены!");
            setSelectedProducts([]);
            navigate("/send");
        } catch (error) {
            toast.error("Ошибка при отправке данных.");
            console.error(error);
            navigate("/send");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAddDisabled = !currentProduct.id || !currentProduct.amount;
    const isSubmitDisabled =
        selectedProducts.length === 0 ||
        Object.values(deliveryInfo).some((value) => !value);

    return (
        <div>
            <NavBar />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "calc(100vh - 64px)",
                }}
            >
                <Box
                    className="Main"
                    sx={{
                        width: "90%",
                        maxWidth: "1200px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 4,
                        justifyContent: "space-between",
                    }}
                >
                    {/* Левая секция */}
                    <Box
                        flex={1}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Typography variant="h6">Добавить товар</Typography>
                        <TextField
                            label="ID товара"
                            value={currentProduct.id}
                            onChange={(e) =>
                                setCurrentProduct({ ...currentProduct, id: e.target.value })
                            }
                            type="number"
                        />
                        <TextField
                            label="Количество"
                            value={currentProduct.amount}
                            onChange={(e) =>
                                setCurrentProduct({ ...currentProduct, amount: e.target.value })
                            }
                            type="number"
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddProduct}
                            disabled={isAddDisabled}
                        >
                            Добавить
                        </Button>

                        <Typography variant="h6" mt={4}>
                            Данные доставки
                        </Typography>
                        <TextField
                            label="Транспортное средство"
                            value={deliveryInfo.vehicle}
                            onChange={(e) =>
                                setDeliveryInfo({ ...deliveryInfo, vehicle: e.target.value })
                            }
                        />
                        <TextField
                            label="Имя водителя"
                            value={deliveryInfo.driverName}
                            onChange={(e) =>
                                setDeliveryInfo({ ...deliveryInfo, driverName: e.target.value })
                            }
                        />
                        <TextField
                            label="Адрес доставки"
                            value={deliveryInfo.deliveryAddress}
                            onChange={(e) =>
                                setDeliveryInfo({
                                    ...deliveryInfo,
                                    deliveryAddress: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Название организации"
                            value={deliveryInfo.organizationName}
                            onChange={(e) =>
                                setDeliveryInfo({
                                    ...deliveryInfo,
                                    organizationName: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Адрес организации"
                            value={deliveryInfo.organizationAddress}
                            onChange={(e) =>
                                setDeliveryInfo({
                                    ...deliveryInfo,
                                    organizationAddress: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Название клиента"
                            value={deliveryInfo.customerName}
                            onChange={(e) =>
                                setDeliveryInfo({
                                    ...deliveryInfo,
                                    customerName: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Адрес клиента"
                            value={deliveryInfo.customerAddress}
                            onChange={(e) =>
                                setDeliveryInfo({
                                    ...deliveryInfo,
                                    customerAddress: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Номер документа"
                            value={deliveryInfo.documentNumber}
                            onChange={(e) =>
                                setDeliveryInfo({
                                    ...deliveryInfo,
                                    documentNumber: e.target.value,
                                })
                            }
                        />
                        <TextField
                            type="date"
                            label="Дата документа"
                            InputLabelProps={{ shrink: true }}
                            value={deliveryInfo.documentDate}
                            onChange={(e) =>
                                setDeliveryInfo({
                                    ...deliveryInfo,
                                    documentDate: e.target.value,
                                })
                            }
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled || isSubmitting}
                        >
                            Отправить
                        </Button>
                    </Box>

                    {/* Правая секция */}
                    <Box
                        flex={1}
                        sx={{
                            backgroundColor: "#ffffff",
                            padding: 2,
                            borderRadius: 1,
                            maxHeight: "400px",
                            overflowY: "auto",
                            boxShadow: 1,
                        }}
                    >
                        <Typography variant="h6">Добавленные товары</Typography>
                        <List>
                            {selectedProducts.map((product, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleRemoveProduct(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={`ID: ${product.id}, Количество: ${product.amount}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default SendGoods;
