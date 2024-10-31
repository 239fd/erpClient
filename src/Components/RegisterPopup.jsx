import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Styles/RegisterPopup.css';

const RegisterPopup = ({ open, onClose }) => {
    const [isNewOrganization, setIsNewOrganization] = useState(false);
    const [fullName, setFullName] = useState('');
    const [organizationNumber, setOrganizationNumber] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Функция для валидации логина
    const validateLogin = (username) => {
        const regex = /^[^#{}\[\]()&%$]{6,}$/; // Должен быть не менее 6 символов и без запрещенных символов
        return regex.test(username);
    };

    // Функция для валидации пароля
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // Должен содержать буквы, цифры и специальные символы
        return regex.test(password);
    };

    // Обработчик регистрации
    const handleRegister = async () => {
        setErrorMessage(''); // Сбрасываем сообщение об ошибке

        if (!validateLogin(username)) {
            setErrorMessage('Логин должен содержать не менее 6 символов и не содержать #{}[]()&%$');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('Пароль должен содержать не менее 8 символов, включать буквы, цифры и специальные символы');
            return;
        }

        const url = isNewOrganization
            ? '/api/register/new-organization' // URL для новой организации
            : '/api/register/existing-organization'; // URL для существующей организации

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                organizationNumber,
                username,
                password,
                registrationNumber: isNewOrganization ? '' : registrationNumber,
            }),
        });

        if (response.ok) {
            onClose(); // Закрываем модалку
            navigate('/main'); // Переходим на главную страницу
        } else {
            const errorText = await response.text();
            setErrorMessage(errorText); // Устанавливаем сообщение об ошибке
            // Обнуление полей при ошибке
            setFullName('');
            setOrganizationNumber('');
            setUsername('');
            setPassword('');
            setRegistrationNumber('');
        }
    };

    // Обработчик изменения чекбокса
    const handleCheckboxChange = (event) => {
        setIsNewOrganization(event.target.checked);
    };

    // Обработчик закрытия модалки
    const handleClose = () => {
        setIsNewOrganization(false);
        setFullName('');
        setOrganizationNumber('');
        setUsername('');
        setPassword('');
        setRegistrationNumber('');
        setErrorMessage('');
        onClose(); // Закрываем модалку
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="register-popup-box">
                <Typography variant="h6" className="register-title">Регистрация</Typography>
                <TextField
                    label="ФИО"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="register-input"
                />
                <TextField
                    label="Номер организации"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={organizationNumber}
                    onChange={(e) => setOrganizationNumber(e.target.value)}
                    className="register-input"
                />
                <TextField
                    label="Логин"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="register-input"
                />
                <TextField
                    label="Пароль"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                />
                <TextField
                    label="Уникальный номер регистрации"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled={isNewOrganization}
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="register-input"
                />
                <FormControlLabel
                    control={<Checkbox checked={isNewOrganization} onChange={handleCheckboxChange} />}
                    label="Новая организация"
                />
                {errorMessage && <Typography color="error">{errorMessage}</Typography>} {/* Отображение ошибки */}
                <Button variant="contained" color="primary" fullWidth onClick={handleRegister} className="register-button">Зарегистрироваться</Button>
            </Box>
        </Modal>
    );
};

export default RegisterPopup;
