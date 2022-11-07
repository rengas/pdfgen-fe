import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';

import profileService from '../../services/profile.service';
import ErrorDialog from '../ErrorDialog/ErrorDialog';
import MessageDialog from '../MessageDialog/MessageDialog';
import './Profile.css';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [editProfile, setEditProfile] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [errDlgOpen, setErrDlgOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgDlgOpen, setMsgDlgOpen] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const res = await profileService.getUserProfile();
        const {data} = res;

        if (data) {
            setProfile(data);
            setApiKey(data.id);
            setEmail(data && 'email' in data && data.email ? data.email : '');
            setFirstName(data && 'firstName' in data && data.firstName ? data.firstName : '');
            setLastName(data && 'lastName' in data && data.lastName ? data.lastName : '');
        }
    }

    const handleGenerate = () => {

    }

    const handleClose = () => {
        setErrDlgOpen(false);
        setMsgDlgOpen(false);
    }

    const validatePayload = () => {
        if (email && firstName && lastName) {
            return true;
        }
    
        if (!email) {
            setErrMsg('Please enter a valid email');
        } else if (!firstName) {
            setErrMsg('Please enter a valid first name');
        } else if (!lastName) {
            setErrMsg('Please enter a valid last name');
        }
        return false;
      }

    const handleUpdate = async () => {
        try {
            if (validatePayload()) {
                const payload = {
                    email,
                    firstName,
                    lastName
                };
                const res = await profileService.updateUserProfile(payload);
                const {data} = res;
      
                if (data) {
                  setMsg('Profile updated successfully');
                  setMsgDlgOpen(true);
      
                  setTimeout(() => {
                    setMsgDlgOpen(false);
                  }, 2000);
                  setEditProfile(false);
                  fetchProfile();
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
        <div className="profile">
            <div className="apikey">
                <div className="apikey__header">Your API KEY:</div>
                {apiKey && <div className="apikey__value">{apiKey}</div>}
                {!apiKey && <div className="apikey__value">&nbsp;</div>}
                <a href="javascript:void(0)" className="apikey__generate" onClick={handleGenerate}>Generate</a>
            </div>

            <div className="profile__body profile-data">
                <div className="profile-data__header">
                    <div className="profile-data__header--text">Profile</div>
                    <div className="profile-data__header--action">
                        {
                            !editProfile && <Tooltip title="Edit Profile">
                                <IconButton aria-label="Edit Profile" size="small" className="custom-btn" onClick={() => setEditProfile(true)}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    </div>
                </div>
                { 
                    editProfile ? <>
                        <div className="login__container profile-form">
                            <h1 className="login__header">Update Profile</h1>
                            <input
                                id="emailID"
                                type="email"
                                className="login__textBox"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter E-mail Address"
                            />
                            <input
                                id="firstName"
                                type="text"
                                className="login__textBox"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter first name"
                            />
                            <input
                                id="lastName"
                                type="text"
                                className="login__textBox"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter last name"
                            />
                            <button className="login__btn" onClick={handleUpdate}>Update</button>
                        </div>
                        </> : <>
                        <div className="profile-data__field">
                            <div className="profile-data__label">Email:</div>
                            <div className="profile-data__value">{profile?.email}</div>
                        </div>
                        <div className="profile-data__field">
                            <div className="profile-data__label">First Name:</div>
                            <div className="profile-data__value">{profile?.firstName}</div>
                        </div>
                        <div className="profile-data__field">
                            <div className="profile-data__label">Last Name:</div>
                            <div className="profile-data__value">{profile?.lastName}</div>
                        </div>
                    </>
                }
            </div>
            <MessageDialog msg={msg} open={msgDlgOpen} onClose={handleClose} />
            <ErrorDialog errorMsg={errMsg} open={errDlgOpen} onClose={handleClose} />
        </div>
    )
}

export default Profile;