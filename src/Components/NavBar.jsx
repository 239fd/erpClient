import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {Person} from "@mui/icons-material";
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
    return (
        <AppBar position="static" className="navbar" style={{backgroundColor:'#FFE98A', color: 'black'}}>
            <Toolbar className="toolbar">
                <Box display="flex" back>
                    <NavItem icon={<HomeIcon className="icon" />} label="Получить" />
                    <NavItem icon={<CheckIcon className="icon" />} label="Отправить" />
                    <NavItem icon={<LocalShippingIcon className="icon" />} label="Инвентаризация" />
                    <NavItem icon={<InventoryIcon className="icon" />} label="Списать" />
                    <NavItem icon={<DeleteIcon className="icon" />} label="Переоценка" />
                    <NavItem icon={<ListAltIcon className="icon" />} label="Склад" />
                    <NavItem icon={<AssessmentIcon className="icon" />} label="Отчёт" />
                    <NavItem icon={<BusinessIcon className="icon" />} label="Поставщик" />
                    <NavItem icon={<OrderIcon className="icon" />} label="Заказ" />
                    <NavItem icon={<TrendingUpIcon className="icon" />} label="Прогноз" />
                </Box>
                <Button color="inherit" style={{ display: 'flex', flexDirection: 'column'}}>
                    <AccountIcon icon = {Person} />
                </Button>
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