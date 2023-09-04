import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { FacebookLogo, InstagramLogo, CurrencyEth, Check, Keyboard } from "@phosphor-icons/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {isSupported, getAnalytics } from "firebase/analytics";
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import ManualSetupScreen from './screens/ManualSetup';
import SettingsScreen from './screens/Settings';
import { BottomBar } from './components/BottomBar';
import { User } from "firebase/auth";
import './App.css';
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
isSupported().then((supportStatus) => {
  if (supportStatus) {
    analytics = getAnalytics(app);
  }
});
// ---------------

function Div2() {
  const Button = ({ logo, label, path }: { logo: JSX.Element, label: string, path: string }) => {
    const navigate = useNavigate();

    /*useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, navigate to home
          navigate('/home');
        }
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, [navigate]);*/

    const handleClick = () => {
      navigate(path);
    };

    return (
      <button className="logo-button" onClick={handleClick}>
        {logo}
        <span>{label}</span>
        <div className="check-circle">
          <Check size={24} />
        </div>
      </button>
    );
  };


  const buttons = [
    { logo: <Keyboard size={32}/>, label: 'Manual mode', path: '/manualsetup' },
    { logo: <FacebookLogo size={32}/>, label: 'Facebook', path: '/home' },
    { logo: <InstagramLogo size={32}/>, label: 'Instagram', path: '/home' },
    { logo: <CurrencyEth size={32} />, label: 'Ethereum', path: '/home' },
  ];

  return (
    <div className="main">
      
      <h1 className="text-wrapper">Welcome</h1>
      <p style={{padding: 10}}>Please import your social graph from your favourite social apps</p>
      
      <div className="container-main">
        {buttons.map((button, index) => (
          <Button key={index} logo={button.logo} label={button.label} path={button.path} />
        ))}
      </div>
      
    </div>
  )
}

export interface AuthContextType {
  currentUser: User | null;
  refetchUser: () => void;
  
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
  const auth = getAuth();

  const refetchUser = () => {
    
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Store user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

      } else {
        // Clear the stored data if user is null
        localStorage.removeItem('currentUser');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  // Get the user data from localStorage
  //const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  return (
    <AuthContext.Provider value={{ currentUser, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

function App() {
  const authContext = useContext(AuthContext);
  const currentUser = authContext ? authContext.currentUser : null;
  console.log('Current user', currentUser);

  return (
    <Router>
    
          {!currentUser ? (
            <Routes>
              <Route path="*" element={<Div2 />} />
              <Route path='/manualsetup' element={<ManualSetupScreen />} />
            </Routes>
          ) : (
            <>
            <Routes>
              <Route path="/home"  element={<HomeScreen />} />
              <Route path='/profile' element={<ProfileScreen />} />
              <Route path='/manualsetup' element={<ManualSetupScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="*" element={<HomeScreen />} />
            </Routes>
            <LocationAwareBottomBar />
            </>
          )}
      
    </Router>
  )
}

function LocationAwareBottomBar() {
  const location = useLocation();
  return <BottomBar activePath={location.pathname} />;
}

export default App


