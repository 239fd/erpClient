import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const DataTable = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Наименование', flex: 2 },
        { field: 'amount', headerName: 'Количество', flex: 1 },
        { field: 'bestBeforeDate', headerName: 'Дата поступления', flex: 1 },
    ];

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                toast.error('Необходима авторизация. Войдите в систему.');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/v1/worker', {
                headers: {
                    Authorization: `Bearer ${token}`, // Передаем токен в заголовке
                },
            });

            if (response.data.status) {
                const transformedData = response.data.data.map((product, index) => ({
                    id: index + 1,
                    name: product.name,
                    amount: product.amount,
                    bestBeforeDate: product.bestBeforeDate,
                }));
                setRows(transformedData);
            } else {
                toast.error('Ошибка при получении данных с сервера');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Сессия истекла. Войдите заново.');
                localStorage.clear();
                window.location.href = '/';
            } else {
                toast.error('Произошла ошибка при запросе данных');
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                loading={loading}
            />
        </Box>
    );
};

export default DataTable;
