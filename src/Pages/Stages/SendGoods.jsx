import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton, FormControl, Select, InputLabel, MenuItem,
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
        customerName: "",
        customerUnp: "",
        customerAddress: "",
        driverFullName: "",
        carNumber: "",
        documentType: "",
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
                "http://localhost:8765/product-service/api/product/dispatch",
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
                            label="Название организации"
                            value={deliveryInfo.customerName}
                            onChange={(e) =>
                                setDeliveryInfo({ ...deliveryInfo, customerName: e.target.value })
                            }
                        />
                        <TextField
                            label="УНП Организации"
                            value={deliveryInfo.customerUnp}
                            onChange={(e) =>
                                setDeliveryInfo({ ...deliveryInfo, customerUnp: e.target.value })
                            }
                        />
                        <TextField
                            label="Адрес доставки"
                            value={deliveryInfo.customerAddress}
                            onChange={(e) =>
                                setDeliveryInfo({
                                    ...deliveryInfo,
                                    customerAddress: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="ФИО Водителя"
                            value={deliveryInfo.driverFullName}
                            onChange={(e) =>
                                setDeliveryInfo({
                                    ...deliveryInfo,
                                    driverFullName: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Номер Машины"
                            value={deliveryInfo.carNumber}
                            onChange={(e) =>
                                setDeliveryInfo({
                                    ...deliveryInfo,
                                    carNumber: e.target.value,
                                })
                            }
                        />
                        <FormControl fullWidth>
                            <InputLabel id="document-type-label">Тип Документа</InputLabel>
                            <Select
                                labelId="document-type-label"
                                id="document-type"
                                value={deliveryInfo.documentType}
                                onChange={(e) =>
                                    setDeliveryInfo({
                                        ...deliveryInfo,
                                        documentType: e.target.value,
                                    })
                                }
                            >
                                <MenuItem value="TTN">TTN</MenuItem>
                                <MenuItem value="TN">TN</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled || isSubmitting}
                        >
                            Отправить
                        </Button>
                    </Box>

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
