import React from 'react';
import { Button } from '@mui/material';
import "../Styles/Header.css";

const Header = ({ setLoginOpen, setRegisterOpen }) => {
    return (
        <header>
            <div className="logo">LOGO</div>
            <nav>
                <Button variant="outlined">Возможности</Button>
                <Button variant="outlined">Тарифы</Button>
                <Button variant="outlined">Поддержка</Button>
            </nav>
            <div className="auth-buttons">
                <Button variant="text" onClick={() => setLoginOpen(true)}>Войти</Button>
                <Button variant="contained" color="primary" onClick={() => setRegisterOpen(true)}>Регистрация</Button>
            </div>
        </header>
    );
};

export default Header;
