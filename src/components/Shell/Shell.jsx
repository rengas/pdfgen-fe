import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useLayoutEffect } from 'react'
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
    const [displaySidebar, setDisplaySidebar] = useState(true);
    const {appState, dispatch} = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, [appState.profileStatus]);

    useLayoutEffect(() => {
        dispatch({type: 'TOGGLE_SIDEBAR_STATUS', payload: displaySidebar});
    }, [displaySidebar]);

    const fetchUser = () => {
        const user = authService.getCurrentUser();
        setUser(user);
    }

    const handleLogout = () => {
        authService.logout();
        navigate('/');
        fetchUser();
    }

    const handleMenuToggle = () => {
        setDisplaySidebar(prev => {
            return !prev;
        });
    }

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
                        <a href="javascript:void(0)" className="app__menus--link" onClick={() => navigate('/profile')}>Settings</a>
                    </div>
                </div>
            }

            <div className={`app__shell ${user ? (appState.sidebar ? 'logged__in' : 'logged__in full-width') : 'logged__out'}`}>
                {
                    user && <div className="app__header">
                        <a href="javascript:void(0)" className="app__menu" onClick={() => handleMenuToggle()}>
                            <MenuIcon />
                        </a>
                        <a href="javascript:void(0)" className="app__logout" onClick={() => handleLogout()}>Logout</a>
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