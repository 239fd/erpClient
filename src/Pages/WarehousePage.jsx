import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Grid,
    Typography,
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
        organizationId: localStorage.getItem("id"),
        racks: [],
    });
    const [newRack, setNewRack] = useState({
        capacity: 0,
        cells: [],
    });
    const [newCell, setNewCell] = useState({
        length: 1.0,
        width: 1.0,
        height: 1.0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("id")) {
            fetchOrganization();
        }
        fetchWarehouses();
    }, []);

    console.log(newWarehouse)

    const fetchOrganization = async () => {
        const id = localStorage.getItem("id");
        try {
            const response = await axios.get(`http://localhost:8765/organization-service/api/organization/id?id=${id}`, {
                headers: { id },
            });

            if (response?.data) {
                setOrganization([response.data]);
            } else {
                toast.error("Ошибка загрузки данных организации.");
            }
        } catch (error) {
            toast.error("Ошибка сервера при загрузке данных.");
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
            const response = await axios.post("http://localhost:8765/organization-service/api/organization", newOrganization, {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.setItem("id", response?.data?.id);
            toast.success("Организация успешно создана!");
            setNewOrganization({ name: "", inn: "", address: "" });
            await fetchOrganization();
        } catch (error) {
            toast.error("Ошибка при создании организации.");
        } finally {
            setIsSubmitting(false);
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

    const handleAddCell = () => {
        if (!newCell.length || !newCell.width || !newCell.height) {
            toast.error("Заполните все размеры ячейки.");
            return;
        }

        setNewRack((prev) => ({
            ...prev,
            cells: [...prev.cells, newCell],
        }));

        setNewCell({
            length: 1.0,
            width: 1.0,
            height: 1.0,
        });
    };

    const handleAddRack = () => {
        if (!newRack.capacity || newRack.cells.length === 0) {
            toast.error("Заполните все поля для стеллажа и добавьте хотя бы одну ячейку.");
            return;
        }

        setNewWarehouse((prev) => ({
            ...prev,
            racks: [...prev.racks, newRack],
        }));

        setNewRack({
            capacity: 0,
            cells: [],
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
            await axios.post("http://localhost:8765/warehouse-service/api/warehouse", newWarehouse, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Склад успешно создан!");
            setNewWarehouse({
                name: "",
                address: "",
                organizationId: localStorage.getItem("id"),
                racks: [],
            });
            fetchWarehouses();
        } catch (error) {
            toast.error("Ошибка при создании склада.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
            renderCell: (params) => {
                const racks = params.row?.racks;
                return Array.isArray(racks) ? racks.length : 0;
            },
        },
    ];

    return (
        <div>
            <NavBar />
            <Box sx={{ padding: "16px" }}>
                <Typography variant="h4" mb={2}>Управление организацией</Typography>
                <Box sx={{ height: 300, mb: 4 }}>
                    <DataGrid
                        rows={organization.map((org, i) => ({ id: org.inn || i, ...org }))}
                        columns={organizationColumns}
                        pageSize={5}
                    />
                </Box>
                <Typography variant="h5" mb={2}>Добавить организацию</Typography>
                <Grid container spacing={2} mb={4}>
                    <Grid item xs={4}><TextField label="Название" fullWidth value={newOrganization.name} onChange={(e) => setNewOrganization({ ...newOrganization, name: e.target.value })} /></Grid>
                    <Grid item xs={4}><TextField label="ИНН" fullWidth value={newOrganization.inn} onChange={(e) => setNewOrganization({ ...newOrganization, inn: e.target.value })} /></Grid>
                    <Grid item xs={4}><TextField label="Адрес" fullWidth value={newOrganization.address} onChange={(e) => setNewOrganization({ ...newOrganization, address: e.target.value })} /></Grid>
                    <Grid item xs={12}><Button variant="contained" onClick={handleCreateOrganization} disabled={isSubmitting}>Добавить организацию</Button></Grid>
                </Grid>

                <Typography variant="h4" mb={2}>Управление складами</Typography>
                <Box sx={{ height: 300, mb: 4 }}>
                    <DataGrid
                        rows={warehouses.map((wh, i) => ({ id: wh.id || i, ...wh }))}
                        columns={warehouseColumns}
                        pageSize={5}
                    />
                </Box>

                <Typography variant="h5" mb={2}>Добавить склад</Typography>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={6}><TextField label="Название склада" fullWidth value={newWarehouse.name} onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })} /></Grid>
                    <Grid item xs={6}><TextField label="Адрес склада" fullWidth value={newWarehouse.address} onChange={(e) => setNewWarehouse({ ...newWarehouse, address: e.target.value })} /></Grid>
                </Grid>

                <Typography variant="h5" mt={4} mb={2}>Добавить стеллаж</Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} mb={2}>
                        <TextField
                            label="Вместимость"
                            type="number"
                            fullWidth
                            value={newRack.capacity}
                            onChange={(e) =>
                                setNewRack((prev) => ({ ...prev, capacity: Number(e.target.value) }))
                            }
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Добавить ячейку:
                        </Typography>
                        <Grid container spacing={2} >
                            <Grid item xs={4}>
                                <TextField
                                    label="Длина"
                                    type="number"
                                    fullWidth
                                    value={newCell.length}
                                    onChange={(e) =>
                                        setNewCell((prev) => ({ ...prev, length: Number(e.target.value) }))
                                    }
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Ширина"
                                    type="number"
                                    fullWidth
                                    value={newCell.width}
                                    onChange={(e) =>
                                        setNewCell((prev) => ({ ...prev, width: Number(e.target.value) }))
                                    }
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Высота"
                                    type="number"
                                    fullWidth
                                    value={newCell.height}
                                    onChange={(e) =>
                                        setNewCell((prev) => ({ ...prev, height: Number(e.target.value) }))
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="outlined" onClick={handleAddCell}>
                                    Добавить ячейку
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Typography variant="body1">Текущие ячейки:</Typography>
                {newRack.cells.map((cell, i) => (
                    <Typography key={i} variant="body2">
                        Ячейка {i + 1}: {cell.length} x {cell.width} x {cell.height}
                    </Typography>
                ))}


                <Button variant="contained" onClick={handleAddRack} sx={{ mt: 4, ml: 2 }}>Добавить стеллаж</Button>
                <Button variant="contained" color="primary" sx={{ mt: 4, ml: 2 }} onClick={handleCreateWarehouse} disabled={isSubmitting}>Добавить склад</Button>
            </Box>
        </div>
    );
};

export default WarehousePage;