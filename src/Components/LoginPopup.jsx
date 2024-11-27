import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchLoginData } from "../Redux/Slies/authSlice";
import { Box, TextField, Button, Typography, Modal } from "@mui/material";
import "./Styles/LoginPopup.css";

const LoginPopup = ({ open, onClose }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const status = useSelector((state) => state.auth.status);
    const errorMessage = useSelector((state) => state.auth.errorMessage);

    useEffect(() => {
        if (status === "loaded") {
            navigate("/main");
            onClose();
        }
    }, [status, navigate, onClose]);

    const validateLogin = (username) => /^[^#{}\]()&%$]{6,}$/.test(username);
    const validatePassword = (password) =>
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);

    const handleLogin = () => {
        if (!validateLogin(username)) {
            alert("Логин должен содержать не менее 6 символов и не содержать #{}[]()&%$");
            return;
        }
        if (!validatePassword(password)) {
            alert("Пароль должен содержать не менее 8 символов, включать буквы, цифры и специальные символы");
            return;
        }

        dispatch(fetchLoginData({ username, password }));
    };

    const handleClose = () => {
        setUsername("");
        setPassword("");
        onClose();
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
                {status === "error" && <Typography color="error">{errorMessage}</Typography>}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                    className="login-button"
                >
                    Войти
                </Button>
            </Box>
        </Modal>
    );
};

export default LoginPopup;
