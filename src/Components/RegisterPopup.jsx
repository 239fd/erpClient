import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUserData, registerDirectorData } from "../Redux/Slies/authSlice";
import {
    Box,
    TextField,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    Modal,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import '../Styles/RegisterPopup.css';
import { toast } from "react-toastify";

const RegisterPopup = ({ open, onClose }) => {
    const [isNewOrganization, setIsNewOrganization] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [surname, setSurname] = useState('');
    const [organizationNumber, setOrganizationNumber] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const status = useSelector((state) => state.auth.status);

    useEffect(() => {
        if (status === "loaded") {
            onClose();
            navigate("/");
        }
    }, [status, navigate, onClose]);

    const validateLogin = (username) => /^[^#{}\]()&%$]{6,}$/.test(username);
    const validatePassword = (password) => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);

    const handleRegister = async () => {
        if (!validateLogin(username)) {
            toast.error("Логин должен содержать не менее 6 символов и не содержать #{}[]()&%$");
            return;
        }
        if (!validatePassword(password)) {
            toast.error("Пароль должен содержать не менее 8 символов, включать буквы, цифры и специальные символы");
            return;
        }

        const signUpData = {
            login: username,
            password,
            phone,
            role,
            firstName,
            secondName,
            surname,
            organizationId: isNewOrganization ? '' : organizationNumber,
        };

        const action = role === "ROLE_DIRECTOR" ? registerDirectorData : registerUserData;

        try {
            const response = await dispatch(action(signUpData)).unwrap(); // Распаковываем успешный ответ
            localStorage.setItem("jwtToken", response.token); // Сохраняем токен
            toast.success("Регистрация прошла успешно!");
            navigate("/home"); // Перенаправляем на главную страницу
            onClose(); // Закрываем модальное окно
        } catch (error) {
            if (error.includes("Login already exist")) {
                toast.error("Логин уже занят. Попробуйте другой.");
            } else if (error.includes("Invalid organization")) {
                toast.error("Неверный номер организации. Проверьте данные.");
            } else {
                toast.error(error || "Ошибка регистрации. Попробуйте ещё раз.");
            }
        }
    };

    const handleCheckboxChange = (event) => {
        setIsNewOrganization(event.target.checked);
        if (event.target.checked && role === 'ROLE_DIRECTOR') {
            setOrganizationNumber('');
        }
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
        setIsNewOrganization(event.target.value === 'ROLE_DIRECTOR');
    };

    const handleClose = () => {
        setIsNewOrganization(false);
        setFirstName('');
        setSecondName('');
        setSurname('');
        setOrganizationNumber('');
        setUsername('');
        setPassword('');
        setPhone('');
        setRole('');
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="register-popup-box">
                <Typography variant="h6" className="register-title">Регистрация</Typography>
                <TextField
                    label="Имя"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                    label="Фамилия"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                />
                <TextField
                    label="Отчество"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Роль</InputLabel>
                    <Select value={role} onChange={handleRoleChange} label="Роль">
                        <MenuItem value="ROLE_WORKER">Рабочий</MenuItem>
                        <MenuItem value="ROLE_ACCOUNTANT">Бухгалтер</MenuItem>
                        <MenuItem value="ROLE_MANAGER">Менеджер</MenuItem>
                        <MenuItem value="ROLE_DIRECTOR">Директор</MenuItem>
                    </Select>
                </FormControl>
                {role && role !== 'ROLE_DIRECTOR' && !isNewOrganization && (
                    <TextField
                        label="Номер организации"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={organizationNumber}
                        onChange={(e) => setOrganizationNumber(e.target.value)}
                    />
                )}
                <TextField
                    label="Логин"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Пароль"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    label="Телефон"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <FormControlLabel
                    control={<Checkbox checked={isNewOrganization} onChange={handleCheckboxChange} />}
                    label="Новая организация"
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleRegister}
                >
                    Зарегистрироваться
                </Button>
            </Box>
        </Modal>
    );
};

export default RegisterPopup;
