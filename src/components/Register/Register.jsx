import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

import { getHostName } from '../../api/apiClient';
import ErrorDialog from '../ErrorDialog/ErrorDialog';
import MessageDialog from '../MessageDialog/MessageDialog';
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState('');
  const [errDlgOpen, setErrDlgOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgDlgOpen, setMsgDlgOpen] = useState(false);
  const navigate = useNavigate();

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
  
  const register = () => {
    try {
      const URL = `${getHostName()}/register`;
      if (validatePayload()) {
          const payload = {
              email,
              password
          };
          const res = await axios.post(URL, payload);
          const {data} = res;

          if (data) {
              console.log(data);
              setMsg(data?.Message);
              setMsgDlgOpen(true);
          }
      } else {
          setErrDlgOpen(true);
      }
    } catch (err) {
        setErrMsg(err?.message);
        setErrDlgOpen(true);
    }
  };

  const handleClose = () => {
    setErrDlgOpen(false);
    setMsgDlgOpen(false);
  }

  useEffect(() => {
    // if (loading) return;
    // if (user) navigate("/dashboard");
  }, []);

  return (
    <div className="register">
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="register__btn" onClick={register}>
          Register
        </button>
        <button
          className="register__btn register__google"
          onClick={signInWithGoogle}
        >
          Register with Google
        </button>
        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>

      <ErrorDialog errorMsg={errMsg} open={errDlgOpen} onClose={handleClose} />
      <MessageDialog msg={msg} open={msgDlgOpen} onClose={handleClose} />
    </div>
  );
}

export default Register;