import React, { useContext } from 'react';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import { AuthContext } from '../App'; // Replace with your actual import
import { AuthContextType } from '../App'; // Replace with your actual import

const SettingsScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { refetchUser } = useContext(AuthContext) as AuthContextType; // Replace with your actual context and function

  const logout = () => {
    auth.signOut().then(() => {
      // Navigate back to home screen after successful logout
      navigate('/');
      refetchUser(); // Call the function to refetch user
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