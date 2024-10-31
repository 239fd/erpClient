import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Styles/LoginPopup.css';

const LoginPopup = ({ open, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const validateLogin = (username) => {
        const regex = /^[^#{}\[\]()&%$]{6,}$/; // Должен быть не менее 6 символов и без запрещенных символов
        return regex.test(username);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // Должен содержать буквы, цифры и специальные символы
        return regex.test(password);
    };

    const handleLogin = async () => {
        setErrorMessage(''); // Сбрасываем сообщение об ошибке

        if (!validateLogin(username)) {
            setErrorMessage('Логин должен содержать не менее 6 символов и не содержать #{}[]()&%$');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('Пароль должен содержать не менее 8 символов, включать буквы, цифры и специальные символы');
            return;
        }

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            onClose(); // Закрываем модалку
            navigate('/main'); // Переходим на главную страницу
        } else {
            const errorText = await response.text();
            setErrorMessage(errorText); // Устанавливаем сообщение об ошибке
            // Обнуление полей при ошибке
            setUsername('');
            setPassword('');
        }
    };

    const handleClose = () => {
        setUsername('');
        setPassword('');
        setErrorMessage('');
        onClose(); // Закрываем модалку
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="login-popup-box">
                <Typography variant="h6" className="login-title">Личный кабинет</Typography>
                <TextField
                    label="Логин"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                />
                <TextField
                    label="Пароль"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                {errorMessage && <Typography color="error">{errorMessage}</Typography>} {/* Отображение ошибки */}
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin} className="login-button">Войти</Button>
            </Box>
        </Modal>
    );
};

export default LoginPopup;
