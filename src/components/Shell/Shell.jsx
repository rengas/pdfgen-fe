import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useLayoutEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

import Login  from '../Login/Login';
import Register from "../Register/Register";
import Reset from "../Reset/Reset";
import Dashboard from "../Dashboard/Dashboard";
import AddDesign from "../AddDesign/AddDesign";
import EditDesign from "../EditDesign/EditDesign";
import Profile from "../Profile/Profile";
import authService from '../../services/auth.service';
import { useApp } from '../../contexts/app.context';
import "./Shell.css";

function Shell() {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [displaySidebar, setDisplaySidebar] = useState(true);
    const {appState, dispatch} = useApp();
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    useEffect(() => {
        fetchUser();
    }, [appState.profileStatus]);

    useLayoutEffect(() => {
        dispatch({type: 'TOGGLE_SIDEBAR_STATUS', payload: displaySidebar});
    }, [displaySidebar]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfileNav = () => {
        setAnchorEl(null);
        navigate('/profile');
    }

    const fetchUser = () => {
        const user = authService.getCurrentUser();
        setUser(user);
    }

    const handleLogout = () => {
        setAnchorEl(null);
        authService.logout();
        navigate('/');
        fetchUser();
    }

    const handleMenuToggle = () => {
        setDisplaySidebar(prev => {
            return !prev;
        });
    }

    const getInitials = (email) => {
        let initials = '';

        if (email) {
            const val = email.split('@')[0];
            const names = val.split(' ');
            initials = names[0].substring(0, 1).toUpperCase();
            
            if (names.length > 1) {
                initials += names[names.length - 1].substring(0, 1).toUpperCase();
            }
        }
        return initials;
    };

    return (
        <>
            {
                user && <div className={appState.sidebar ? 'sidebar' : 'sidebar hidden'}>
                    <div className="app__logo">
                        <img src="logo.svg" alt="Logo Image" />
                    </div>

                    <div className="app__menus">
                        <a href="javascript:void(0)" className="app__menus--link" onClick={() => navigate('/dashboard')}>Dashboard</a>
                        <a href="javascript:void(0)" className="app__menus--link" onClick={() => navigate('/add-design')}>Design</a>
                        <a href="javascript:void(0)" className="app__menus--link" onClick={() => navigate('/profile')}>My Account</a>
                    </div>
                </div>
            }

            <div className={`app__shell ${user ? (appState.sidebar ? 'logged__in' : 'logged__in full-width') : 'logged__out'}`}>
                {
                    user && <div className="app__header">
                        <a href="javascript:void(0)" className="app__menu" onClick={() => handleMenuToggle()}>
                            <MenuIcon />
                        </a>

                        <Button
                            id="menu-btn"
                            className="app__profile custom-btn"
                            onClick={handleClick}
                        >
                            {getInitials(user.user.email)}
                        </Button>
                        <Menu
                            id="menu-item"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{  
                                style: {  
                                  width: 150,  
                                },  
                             }} 
                        >
                            <MenuItem onClick={handleProfileNav}>My Account</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                }
                <div className={`app__body ${user ? 'logged_in' : ''}`}>
                    <Routes>
                        <Route exact path="/" element={<Login />} />
                        <Route exact path="/register" element={<Register />} />
                        <Route exact path="/reset" element={<Reset />} />
                        <Route exact path="/dashboard" element={<Dashboard />} />
                        <Route exact path="/add-design" element={<AddDesign />} />
                        <Route exact path="/edit-design/:id" element={<EditDesign />} />
                        <Route exact path="/profile" element={<Profile />} />
                    </Routes>
                </div>
            </div>
        </>
    )
}

export default Shell;