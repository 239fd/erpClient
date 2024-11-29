import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";

const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [newSupplier, setNewSupplier] = useState({
        name: "",
        inn: "",
        address: "",
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get("http://localhost:8080/api/v1/manager/supplier", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuppliers(response.data.data);
        } catch (error) {
            toast.error("Ошибка при загрузке поставщиков.");
        }
    };

    const handleAddSupplier = async () => {
        if (!newSupplier.name || !newSupplier.inn || !newSupplier.address) {
            toast.error("Заполните все поля.");
            return;
        }

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            await axios.post("http://localhost:8080/api/v1/manager/supplier", newSupplier, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Поставщик добавлен!");
            setNewSupplier({ name: "", inn: "", address: "" });
            fetchSuppliers();
        } catch (error) {
            toast.error("Ошибка при добавлении поставщика.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateSupplier = async () => {
        if (!selectedSupplier) return;

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            await axios.put("http://localhost:8080/api/v1/manager/supplier", selectedSupplier, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Информация о поставщике обновлена!");
            fetchSuppliers();
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Ошибка при обновлении поставщика.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSupplier = async (supplier) => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.delete("http://localhost:8080/api/v1/manager/supplier", {
                data: { id: supplier.id },
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Поставщик удален!");
            fetchSuppliers();
        } catch (error) {
            toast.error("Ошибка при удалении поставщика.");
        }
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Название", flex: 1.5 },
        { field: "inn", headerName: "ИНН", flex: 1 },
        { field: "address", headerName: "Адрес", flex: 2 },
        {
            field: "actions",
            headerName: "Действия",
            flex: 1,
            renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setSelectedSupplier(params.row);
                            setIsDialogOpen(true);
                        }}
                    >
                        Редактировать
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDeleteSupplier(params.row)}
                        sx={{ ml: 1 }}
                    >
                        Удалить
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ padding: "16px" }}>
            <Typography variant="h4" mb={2}>Управление поставщиками</Typography>
            <Box sx={{ height: 400, mb: 4 }}>
                <DataGrid
                    rows={suppliers}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextField
                        label="Название"
                        value={newSupplier.name}
                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="ИНН"
                        value={newSupplier.inn}
                        onChange={(e) => setNewSupplier({ ...newSupplier, inn: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Адрес"
                        value={newSupplier.address}
                        onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddSupplier}
                        disabled={isSubmitting}
                    >
                        Добавить поставщика
                    </Button>
                </Grid>
            </Grid>

            {/* Диалоговое окно для редактирования */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Редактировать поставщика</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={selectedSupplier?.name || ""}
                        onChange={(e) =>
                            setSelectedSupplier((prev) => ({ ...prev, name: e.target.value }))
                        }
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="ИНН"
                        value={selectedSupplier?.inn || ""}
                        onChange={(e) =>
                            setSelectedSupplier((prev) => ({ ...prev, inn: e.target.value }))
                        }
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Адрес"
                        value={selectedSupplier?.address || ""}
                        onChange={(e) =>
                            setSelectedSupplier((prev) => ({ ...prev, address: e.target.value }))
                        }
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleUpdateSupplier} disabled={isSubmitting}>
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SuppliersPage;
