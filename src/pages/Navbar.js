import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import {useNavigate} from 'react-router-dom';

const drawerWidth = 240;
const navItems = [
    {label: 'Offer', path: '/offer'},
    {label: 'Category', path: '/category'},
    {label: 'Product List', path: '/'},
    {label: 'Contact Listing', path: '/contactlisting'}
];

function Navbar(props) {
    const {window} = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleDrawerToggle();
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
            <Typography variant="h6" sx={{my: 2}}>
                PRODUCT
            </Typography>
            <Divider/>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            sx={{textAlign: 'center'}}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <ListItemText primary={item.label}/>
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <Tooltip title="Logout" arrow>
                        <ListItemButton sx={{textAlign: 'center', color: 'red'}} onClick={handleLogout}>
                            <ListItemText primary="Logout"/>
                        </ListItemButton>
                    </Tooltip>
                </ListItem>
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{display: 'flex', mb: "100px"}}>
            <CssBaseline/>
            <AppBar component="nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}, cursor: 'pointer'}}
                        onClick={handleHomeClick}
                    >
                        PRODUCT
                    </Typography>
                    <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                sx={{color: '#fff', '&:hover': {color: '#ddd'}}}
                                onClick={() => handleNavigation(item.path)}
                            >
                                {item.label}
                            </Button>
                        ))}
                        <Tooltip title="Logout" arrow>
                            <Button
                                sx={{color: '#fff', '&:hover': {color: '#dd0000'}}}
                                onClick={handleLogout}
                            >
                                <LogoutIcon sx={{mr: 1}}/> Logout
                            </Button>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}

Navbar.propTypes = {
    window: PropTypes.func,
    setIsAuthenticated: PropTypes.func.isRequired,
};

export default Navbar;
