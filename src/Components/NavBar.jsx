import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logOut } from "../Redux/Slies/authSlice";
import { toast } from "react-toastify";
import '../Styles/NavBar.css';

import { ReactComponent as HomeIcon } from './Images/CompleteImage.svg';
import { ReactComponent as CheckIcon } from './Images/TransportationImage.svg';
import { ReactComponent as LocalShippingIcon } from './Images/ReportImage.svg';
import { ReactComponent as InventoryIcon } from './Images/GarbageImage.svg';
import { ReactComponent as DeleteIcon } from './Images/ListImage.svg';
import { ReactComponent as ListAltIcon } from './Images/WarehouseImage.svg';
import { ReactComponent as AssessmentIcon } from './Images/ChartImage.svg';
import { ReactComponent as BusinessIcon } from './Images/enter_kmim22s90f7v.svg';
import { ReactComponent as OrderIcon } from './Images/ListImage.svg';
import { ReactComponent as TrendingUpIcon } from './Images/GraphImage.svg';
import { ReactComponent as ExitIcon } from "./Images/Exit.svg";

export default function NavBar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const role = JSON.parse(localStorage.getItem("user"))?.role; // Получаем роль из localStorage

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleLogout = () => {
        try {
            localStorage.clear();
            dispatch(logOut());
            toast.success("Вы успешно вышли из системы.");
            navigate("/");
        } catch (error) {
            toast.error("Ошибка при выходе.");
        }
    };

    const handleNavigation = (path, allowedRoles) => {
        if (!allowedRoles.includes(role)) {
            toast.error("У вас нет доступа к этой странице.");
        } else {
            navigate(path);
        }
    };

    const menuItems = [
        {
            icon: <HomeIcon className="icon" />,
            label: "Получить",
            path: "/take",
            allowedRoles: ["ROLE_WORKER"],
        },
        {
            icon: <CheckIcon className="icon" />,
            label: "Отправить",
            path: "/send",
            allowedRoles: ["ROLE_WORKER"],
        },
        {
            icon: <LocalShippingIcon className="icon" />,
            label: "Инвентаризация",
            path: "/inventory",
            allowedRoles: ["ROLE_ACCOUNTANT"],
        },
        {
            icon: <InventoryIcon className="icon" />,
            label: "Списать",
            path: "/writeoff",
            allowedRoles: ["ROLE_ACCOUNTANT"],
        },
        {
            icon: <DeleteIcon className="icon" />,
            label: "Переоценка",
            path: "/revaluation",
            allowedRoles: ["ROLE_ACCOUNTANT"],
        },
        {
            icon: <ListAltIcon className="icon" />,
            label: "Склад",
            path: "/warehouse",
            allowedRoles: ["ROLE_DIRECTOR"],
        },
        {
            icon: <AssessmentIcon className="icon" />,
            label: "Отчёт",
            path: "/report",
            allowedRoles: ["ROLE_DIRECTOR"],
        },
        {
            icon: <BusinessIcon className="icon" />,
            label: "Поставщик",
            path: "/supplier",
            allowedRoles: ["ROLE_MANAGER"],
        },
        {
            icon: <OrderIcon className="icon" />,
            label: "Заказ",
            path: "/order",
            allowedRoles: ["ROLE_MANAGER"],
        },
        {
            icon: <TrendingUpIcon className="icon" />,
            label: "Прогноз",
            path: "/forecast",
            allowedRoles: ["ROLE_MANAGER"],
        },
    ];

    return (
        <AppBar position="static" className="navbar" style={{ backgroundColor: '#FFE98A', color: 'black' }}>
            <Toolbar className="toolbar" style={{ justifyContent: 'center' }}>
                <Box display="flex" justifyContent="space-between" width="100%">
                    {isMobile ? (
                        <>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor="left"
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                                PaperProps={{
                                    sx: { backgroundColor: '#FFE98A', color: 'black' },
                                }}
                            >
                                <Box
                                    role="presentation"
                                    onClick={toggleDrawer(false)}
                                    onKeyDown={toggleDrawer(false)}
                                    sx={{ backgroundColor: '#FFE98A', height: '100%' }}
                                >
                                    <List>
                                        {menuItems.map((item, index) => (
                                            <ListItem
                                                button
                                                key={index}
                                                onClick={() => handleNavigation(item.path, item.allowedRoles)}
                                            >
                                                <ListItemIcon sx={{ color: 'black' }}>{item.icon}</ListItemIcon>
                                                <ListItemText primary={item.label} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        <Box display="flex" justifyContent="center" flexGrow={1}>
                            {menuItems.map((item, index) => (
                                <Button
                                    key={index}
                                    color="inherit"
                                    onClick={() => handleNavigation(item.path, item.allowedRoles)}
                                    className="nav-item"
                                >
                                    {item.icon}
                                    <span className="label">{item.label}</span>
                                </Button>
                            ))}
                        </Box>
                    )}
                    <Button
                        color="inherit"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 'auto',
                            height: 'auto',
                            padding: 10,
                        }}
                        onClick={handleLogout}
                    >
                        <ExitIcon style={{ width: '24px', height: '24px' }} />
                        <span style={{ fontSize: '12px' }}>Выйти</span>
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
