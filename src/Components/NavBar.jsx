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
import './Styles/NavBar.css';

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
import { ReactComponent as AccountIcon } from './Images/GraphImage.svg';

export default function NavBar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        { icon: <HomeIcon className="icon" />, label: "Получить" },
        { icon: <CheckIcon className="icon" />, label: "Отправить" },
        { icon: <LocalShippingIcon className="icon" />, label: "Инвентаризация" },
        { icon: <InventoryIcon className="icon" />, label: "Списать" },
        { icon: <DeleteIcon className="icon" />, label: "Переоценка" },
        { icon: <ListAltIcon className="icon" />, label: "Склад" },
        { icon: <AssessmentIcon className="icon" />, label: "Отчёт" },
        { icon: <BusinessIcon className="icon" />, label: "Поставщик" },
        { icon: <OrderIcon className="icon" />, label: "Заказ" },
        { icon: <TrendingUpIcon className="icon" />, label: "Прогноз" },
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
                                            <ListItem button key={index}>
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
                                <NavItem key={index} icon={item.icon} label={item.label} />
                            ))}
                        </Box>
                    )}
                    <Button color="inherit" style={{ display: 'flex', flexDirection: 'column' }}>
                        <AccountIcon />
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

function NavItem({ icon, label }) {
    return (
        <Button color="inherit" className="nav-item">
            {icon}
            <span className="label">{label}</span>
        </Button>
    );
}
