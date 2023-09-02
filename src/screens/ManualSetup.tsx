import React, { useState } from 'react';
import "./ManualSetup.css" 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, child } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

// Inside your component

const SignUpScreen = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  
  const navigate = useNavigate();
  //
  const [error, setError] = useState<string | null>(null);
  const handleSignUpClick = async () => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const db = getDatabase();
      const profileRef = ref(db, 'users/' + user.uid);
      
      await Promise.all([
        set(child(profileRef, 'username'), name),
        set(child(profileRef, 'interests'), interests)
      ]);
      
      navigate('/home'); // Assuming '/' is the path to your HomeScreen
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }
  //
  return (
    <div className='ManualContainer'>
      <label htmlFor="profilePic" className="profilePicLabel">
      <button 
        type="button" 
        className="logo-button UploadButton" 
        onClick={() => {
            const profilePicElement = document.getElementById('profilePic');
            if (profilePicElement) {
            profilePicElement.click();
            }
        }}
        >
        Upload Profile Picture
        </button>
      </label>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Enter name" 
        className='input'
      />
      <select 
        className='input'
        onChange={(e) => setInterests(e.target.value)}
      >
        <option value="">Select Interest</option>
        <option value="coding">Coding</option>
        <option value="design">Design</option>
        <option value="marketing">Marketing</option>
        <option value="business">Business</option>
      </select>
      
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Enter email" 
        className='input'
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Enter password" 
        className='input'
      />
      
      
      {error && <p className="error">{error}</p>}
      
      <button onClick={handleSignUpClick}>Confirm</button>
    </div>
  );
}

export default SignUpScreen;
