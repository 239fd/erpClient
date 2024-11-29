import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Grid,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";

const WarehousePage = () => {
    const [organization, setOrganization] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [newOrganization, setNewOrganization] = useState({
        name: "",
        inn: "",
        address: "",
    });
    const [newWarehouse, setNewWarehouse] = useState({
        name: "",
        address: "",
        racks: [],
    });
    const [newRack, setNewRack] = useState({
        capacity: 0,
        cellCount: 0,
        cellHeight: 1.0,
        cellWidth: 1.0,
        cellLength: 1.0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchOrganization();
        fetchWarehouses();
    }, []);

    const fetchOrganization = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get("http://localhost:8080/api/v1/director/organization", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status && response.data.data) {
                setOrganization([response.data.data]);
            } else {
                toast.error("Ошибка загрузки данных организации.");
            }
        } catch (error) {
            toast.error("Ошибка сервера при загрузке данных.");
        }
    };

    const fetchWarehouses = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get("http://localhost:8080/api/v1/director/organization/warehouses", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status && response.data.data) {
                setWarehouses(response.data.data);
            } else {
                toast.error("Ошибка загрузки данных складов.");
            }
        } catch (error) {
            toast.error("Ошибка сервера при загрузке данных.");
        }
    };

    const handleAddRack = () => {
        if (!newRack.capacity || !newRack.cellCount) {
            toast.error("Заполните все поля для стеллажа.");
            return;
        }

        setNewWarehouse((prev) => ({
            ...prev,
            racks: [...prev.racks, newRack],
        }));

        setNewRack({
            capacity: 0,
            cellCount: 0,
            cellHeight: 1.0,
            cellWidth: 1.0,
            cellLength: 1.0,
        });
    };

    const handleCreateWarehouse = async () => {
        if (!newWarehouse.name || !newWarehouse.address || newWarehouse.racks.length === 0) {
            toast.error("Заполните все поля склада.");
            return;
        }

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            await axios.post("http://localhost:8080/api/v1/director/organization/warehouse", newWarehouse, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Склад успешно создан!");
            setNewWarehouse({
                name: "",
                address: "",
                racks: [],
            });
            fetchWarehouses();
        } catch (error) {
            toast.error("Ошибка при создании склада.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleCreateOrganization = async () => {
        if (!newOrganization.name || !newOrganization.inn || !newOrganization.address) {
            toast.error("Заполните все поля.");
            return;
        }
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            await axios.post("http://localhost:8080/api/v1/director/organization", newOrganization, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Организация успешно создана!");
            setNewOrganization({ name: "", inn: "", address: "" });
            fetchOrganization();        } catch (error) {
            toast.error("Ошибка при создании организации.");
        } finally {
            setIsSubmitting(false);
        }    };

    const organizationColumns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Название", flex: 1.5 },
        { field: "inn", headerName: "ИНН", flex: 1 },
        { field: "address", headerName: "Адрес", flex: 2 },
    ];

    const warehouseColumns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Название", flex: 1.5 },
        { field: "address", headerName: "Адрес", flex: 2 },
        {
            field: "racks",
            headerName: "Количество стоек",
            flex: 1,
            valueGetter: (params) => {
                if (!params || !params.row || !params.row.racks) {
                    return 0;
                }
                return params.row.racks.length;
            },
        },
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
                            // Логика редактирования склада
                        }}
                    >
                        Редактировать
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => {
                            // Логика удаления склада
                        }}
                        sx={{ ml: 1 }}
                    >
                        Удалить
                    </Button>
                </>
            ),
        },
    ];

    const organizationRows = organization.map((org, index) => ({
        id: org.inn || index,
        ...org,
    }));

    const warehouseRows = warehouses.map((warehouse, index) => ({
        id: warehouse.id || index,
        ...warehouse,
    }));

    return (
        <div>
            <NavBar />
            <Box sx={{ padding: "16px" }}>
                <Typography variant="h4" mb={2}>
                    Управление организацией
                </Typography>
                <Box sx={{ height: 300, mb: 4 }}>
                    <DataGrid
                        rows={organizationRows}
                        columns={organizationColumns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10]}
                    />
                </Box>
                <Typography variant="h5" mb={2}>
                    Добавить организацию
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Название"
                            value={newOrganization.name}
                            onChange={(e) =>
                                setNewOrganization({ ...newOrganization, name: e.target.value })
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="ИНН"
                            value={newOrganization.inn}
                            onChange={(e) =>
                                setNewOrganization({ ...newOrganization, inn: e.target.value })
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Адрес"
                            value={newOrganization.address}
                            onChange={(e) =>
                                setNewOrganization({ ...newOrganization, address: e.target.value })
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateOrganization}
                            disabled={isSubmitting}
                        >
                            Добавить организацию
                        </Button>
                    </Grid>
                </Grid>
                <Typography variant="h4" mt={4} mb={2}>
                    Управление складами
                </Typography>
                <Box sx={{ height: 300, mb: 4 }}>
                    <DataGrid
                        rows={warehouseRows}
                        columns={warehouseColumns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10]}
                    />
                </Box>
                <Typography variant="h5" mb={2}>
                    Добавить склад
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Название склада"
                            value={newWarehouse.name}
                            onChange={(e) =>
                                setNewWarehouse({ ...newWarehouse, name: e.target.value })
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Адрес склада"
                            value={newWarehouse.address}
                            onChange={(e) =>
                                setNewWarehouse({ ...newWarehouse, address: e.target.value })
                            }
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Typography variant="h6" mt={4} mb={2}>
                    Добавить стеллаж
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Вместимость"
                            type="number"
                            value={newRack.capacity}
                            onChange={(e) => setNewRack((prev) => ({ ...prev, capacity: e.target.value }))}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Кол-во ячеек"
                            type="number"
                            value={newRack.cellCount}
                            onChange={(e) => setNewRack((prev) => ({ ...prev, cellCount: e.target.value }))}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Высота ячейки"
                            type="number"
                            value={newRack.cellHeight}
                            onChange={(e) => setNewRack((prev) => ({ ...prev, cellHeight: e.target.value }))}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Ширина ячейки"
                            type="number"
                            value={newRack.cellWidth}
                            onChange={(e) => setNewRack((prev) => ({ ...prev, cellWidth: e.target.value }))}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Длина ячейки"
                            type="number"
                            value={newRack.cellLength}
                            onChange={(e) => setNewRack((prev) => ({ ...prev, cellLength: e.target.value }))}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button variant="contained" onClick={handleAddRack}>
                            Добавить стеллаж
                        </Button>
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4 }}
                    onClick={handleCreateWarehouse}
                    disabled={isSubmitting}
                >
                    Добавить склад
                </Button>
            </Box>
        </div>
    );
};

export default WarehousePage;
