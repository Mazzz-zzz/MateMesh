import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FacebookLogo, InstagramLogo, CurrencyEth, Check, Keyboard } from "@phosphor-icons/react";
import './AddSources.css';


export function AddSources() {
  const [isInstagramActive, setIsInstagramActive] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
        // ...
        if (event.data.action === 'dataFetched') {
            console.log(event.data.data); // This is the data from instagramfetch.js
        }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Clean up the event listener when the component is unmounted
    return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
    };
}, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log(event)
      if (event.data.message === 'urlChanged') {
        setIsInstagramActive(event.data.url.includes('instagram.com'));
      }
    };
  
    // Add this function to check the active tab
    const checkActiveTab = () => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          console.log("tabs are")
          console.log(tabs)
          setIsInstagramActive(tabs[0].url === 'https://www.instagram.com/direct/inbox/');
        }
      });
    };
  
    window.addEventListener('message', handleMessage);
  
    // Call the function when the component mounts
    checkActiveTab();
  
    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('message', handleMessage);
    };
    
  }, []);




  const Button = ({ logo, label, path }: { logo: JSX.Element, label: string, path: string }) => {
    const navigate = useNavigate();

    const handleClick = () => {
      if (label === 'Instagram') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0] && tabs[0].id !== undefined) {
            console.log("sending message...")
            chrome.runtime.sendMessage({
              action: "executeScript",
              tabId: tabs[0].id,
              file: '/src/contentscripts/instagramfetch.js.js' 
            });
          }
        });
      }
      navigate(path);
    };

    return (
      <button className={`logo-button ${label === 'Instagram' && isInstagramActive ? 'active' : ''}`} onClick={handleClick}>
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

      
      <div className="container-main">
        {buttons.map((button, index) => (
          <Button key={index} logo={button.logo} label={button.label} path={button.path} />
        ))}
      </div>
    </div>
  )
}

export default AddSources;