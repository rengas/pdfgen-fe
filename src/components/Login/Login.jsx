import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ErrorDialog from '../ErrorDialog/ErrorDialog';
import MessageDialog from '../MessageDialog/MessageDialog';
import authService from '../../services/auth.service';
import { useApp } from '../../contexts/app.context';
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState('');
  const [errDlgOpen, setErrDlgOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgDlgOpen, setMsgDlgOpen] = useState(false);
  const {dispatch} = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      cleanUpPage();
    }
  }, []);

  const cleanUpPage = () => {
    setPassword('');
    setEmail('');
    setErrMsg('');
    setMsg('');
  }

  const handleClose = () => {
    setErrDlgOpen(false);
    setMsgDlgOpen(false);
  }

  const validatePayload = () => {
    if (email && password) {
        return true;
    }

    if (!email) {
        setErrMsg('Please enter a valid email');
    } else if (!password) {
        setErrMsg('Please enter a valid password');
    }
    return false;
  }

  const login = async () => {
    try {
      if (validatePayload()) {
          const payload = {
              email,
              password
          };
          const res = await authService.login(payload);
          const {data} = res;

          if (data) {
            console.log(data);
            setMsg(data?.Message);
            setMsgDlgOpen(true);
            dispatch({type: 'TOGGLE_PROFILE_STATUS'})
            navigate('/dashboard');

            setTimeout(() => {
              setMsgDlgOpen(false);
            }, 2000);
          }
      } else {
          setErrDlgOpen(true);
      }
    } catch (err) {
        setErrMsg(err?.message);
        setErrDlgOpen(true);
    }
  }

  return (
    <div className="login">
      <div className="login__container">
        <img src="public/logo.svg" alt="" className="login__logo" />
        <h1 className="login__header">Sign In</h1>
        <input
          id="emailID"
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />

        <input
          id="password"
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => login()}
        >
          Login
        </button>
        {/* <button className="login__btn login__google" onClick={login}>
          Login with Google
        </button> */}
        <div className="login__forgot-password">
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>

      <ErrorDialog errorMsg={errMsg} open={errDlgOpen} onClose={handleClose} />
      <MessageDialog msg={msg} open={msgDlgOpen} onClose={handleClose} />
    </div>
  );
}

export default Login;