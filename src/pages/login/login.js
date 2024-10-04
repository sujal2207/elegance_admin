import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Modal,
    TextField,
    Button,
    Typography,
    Box,
    Snackbar,
    Alert,
    IconButton,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import icons for show/hide

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#f9f9f9',
    border: '1px solid #ccc',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [openModal, setOpenModal] = React.useState(true);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false); // State for password visibility

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('https://elegance-backend-haqu.onrender.com/api/user/login', {
                email: data.email,
                password: data.password,
            });

            if (response.status === 200) {
                const token = response?.data?.data?.token;
                sessionStorage.setItem('token', JSON.stringify(token));
                setSnackbarMessage('Login successful!');
                navigate('/');
                setOpenModal(false);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setSnackbarMessage(error.response.data.message || 'Login failed. Please check your credentials.');
            } else {
                setSnackbarMessage('An error occurred. Please try again later.');
            }
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleModalClose = () => {
        console.log('Modal cannot be closed by clicking outside.');
    };

    return (
        <Modal open={openModal} onClose={handleModalClose}>
            <Box sx={style}>
                <Typography component="h1" variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Email"
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Invalid email address',
                            },
                        })}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ''}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                boxShadow: errors.email ? '0 0 5px rgba(255, 0, 0, 0.5)' : 'none',
                            },
                        }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'} // Change type based on state
                        {...register('password', { required: 'Password is required' })}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password.message : ''}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                boxShadow: errors.password ? '0 0 5px rgba(255, 0, 0, 0.5)' : 'none',
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                                    edge="end"
                                    aria-label="toggle password visibility"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 2,
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                            borderRadius: '8px',
                        }}
                    >
                        Login
                    </Button>
                </Box>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    sx={{
                        '& .MuiSnackbarContent-root': {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbarMessage.includes('failed') ? "error" : "success"}
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Modal>
    );
};

export default Login;
