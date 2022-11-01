import { useState, useEffect } from 'react';

import profileService from '../../services/profile.service';
import './Profile.css';

function Profile() {
    const [profile, setProfile] = useState('');
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const res = await profileService.getUserProfile();
        const {data} = res;

        if (data) {
            setProfile(data.email);
            setApiKey(data.id);
        }
    }

    const handleGenerate = () => {

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
                <div className="profile-data__header">Profile</div>
                <div className="profile-data__field">
                    <div className="profile-data__label">Email:</div>
                    <div className="profile-data__value">{profile}</div>
                </div>
            </div>
        </div>
    )
}

export default Profile;