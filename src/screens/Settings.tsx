import React from 'react';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const SettingsScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const auth = getAuth();

  const logout = () => {
    auth.signOut().then(() => {
      // Navigate back to home screen after successful logout
      navigate('/');
    }).catch((error) => {
      // Handle any errors here
      console.error(error);
    });
  };

  return (
    <div className='main'>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default SettingsScreen