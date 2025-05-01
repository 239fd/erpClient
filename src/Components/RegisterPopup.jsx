import React, { useReducer, useEffect } from "react";
import { useDispatch } from "react-redux";
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
import GoogleSSOButton from "./GoogleSSOButton";
import YandexSSOButton from "./YandexSSOButton";

const initialFormState = {
    firstName: '',
    secondName: '',
    surname: '',
    organizationNumber: '',
    username: '',
    password: '',
    phone: '',
    role: '',
    isNewOrganization: false
};

function formReducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "RESET":
            return initialFormState;
        default:
            return state;
    }
}

const Roles = {
    WORKER: "worker",
    ACCOUNTANT: "accountant",
    DIRECTOR: "director"
};

const RegisterPopup = ({ open, onClose }) => {
    const [form, dispatchForm] = useReducer(formReducer, initialFormState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) {
            dispatchForm({ type: "RESET" });
        }
    }, [open]);

    const validateLogin = (username) => /^[^#{}\]()&%$]{6,}$/.test(username);
    const validatePassword = (password) =>
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);

    const handleRegister = async () => {
        const { username, password, role, firstName, secondName, surname, phone, isNewOrganization, organizationNumber } = form;

        if (!firstName || !secondName || !surname || !phone || !role || !username || !password) {
            toast.error("Пожалуйста, заполните все поля.");
            return;
        }

        if (!validateLogin(username)) {
            toast.error("Логин должен содержать не менее 6 символов и не содержать #{}[]()&%$");
            return;
        }

        if (!validatePassword(password)) {
            toast.error("Пароль должен содержать не менее 8 символов, включать буквы, цифры и спецсимвол");
            return;
        }

        const signUpData = isNewOrganization ? {
            login: username,
            password,
            firstName,
            phone,
            secondName,
            title: role,
        } : {
            login: username,
                password,
                firstName,
                phone,
                secondName,
                title: role,
            code: organizationNumber,
        }

        const getRegisterAction = (role) =>
            role === Roles.DIRECTOR ? registerDirectorData : registerUserData;

        try {
            const response = await dispatch(getRegisterAction(role)(signUpData)).unwrap();
            localStorage.setItem("jwtToken", response.accessToken);
            localStorage.setItem("refresh", response.refreshToken);
            localStorage.setItem("role", signUpData.title);

            toast.success("Регистрация прошла успешно!");
            navigate("/home");
            onClose();
        } catch (error) {
            const errorMessage = typeof error === "string" ? error : "Ошибка регистрации. Попробуйте ещё раз.";

            if (errorMessage.includes("Login already exist")) {
                toast.error("Логин уже занят. Попробуйте другой.");
            } else if (errorMessage.includes("Invalid organization")) {
                toast.error("Неверный номер организации. Проверьте данные.");
            } else {
                toast.error(errorMessage);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleRegister();
        }
    };

    const handleClose = () => {
        dispatchForm({ type: "RESET" });
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="register-popup-box" onKeyDown={handleKeyPress}>
                <Typography variant="h6" className="register-title">Регистрация</Typography>

                <TextField label="Имя" fullWidth margin="normal"
                           value={form.firstName}
                           onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "firstName", value: e.target.value })}
                />
                <TextField label="Фамилия" fullWidth margin="normal"
                           value={form.secondName}
                           onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "secondName", value: e.target.value })}
                />
                <TextField label="Отчество" fullWidth margin="normal"
                           value={form.surname}
                           onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "surname", value: e.target.value })}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Роль</InputLabel>
                    <Select value={form.role} onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "role", value: e.target.value })}>
                        <MenuItem value={Roles.WORKER}>Рабочий</MenuItem>
                        <MenuItem value={Roles.ACCOUNTANT}>Бухгалтер</MenuItem>
                        <MenuItem value={Roles.DIRECTOR}>Директор</MenuItem>
                    </Select>
                </FormControl>

                {form.role && form.role !== Roles.DIRECTOR && !form.isNewOrganization && (
                    <TextField
                        label="Номер организации"
                        fullWidth margin="normal"
                        value={form.organizationNumber}
                        onChange={(e) =>
                            dispatchForm({ type: "SET_FIELD", field: "organizationNumber", value: e.target.value })
                        }
                    />
                )}

                <TextField
                    label="Логин" fullWidth margin="normal"
                    value={form.username}
                    onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "username", value: e.target.value })}
                />
                <TextField
                    label="Пароль" type="password" fullWidth margin="normal"
                    value={form.password}
                    onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "password", value: e.target.value })}
                />
                <TextField
                    label="Телефон" fullWidth margin="normal"
                    value={form.phone}
                    onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "phone", value: e.target.value })}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={form.isNewOrganization}
                            onChange={(e) =>
                                dispatchForm({ type: "SET_FIELD", field: "isNewOrganization", value: e.target.checked })
                            }
                        />
                    }
                    label="Новая организация"
                />

                <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
                    Зарегистрироваться
                </Button>

                <div className="or-divider">или</div>
                <div className="sso-buttons-container">
                    <YandexSSOButton />
                    <GoogleSSOButton />
                </div>
            </Box>
        </Modal>
    );
};

export default RegisterPopup;
