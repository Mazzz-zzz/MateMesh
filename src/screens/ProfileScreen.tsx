import React, { useEffect, useState } from 'react';
import { getDatabase, ref as dbRef , onValue, set } from "firebase/database";
import { getStorage, uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage"
import { getAuth } from "firebase/auth";
import './ProfileScreen.css';

const ProfileScreen = (): JSX.Element => {
  const [profile, setProfile] = useState<{username: string, interests: string} | null>(null);
  const [friendDetails, setFriendDetails] = useState<{name: string, skills: string, profilePic: File | null} | null>(null);
  
  const auth = getAuth();
  const [error, setError] = useState<string | null>(null);
  const storage = getStorage();

  const handleFriendAdd = async () => {
    const db = getDatabase();
    const friendName = friendDetails?.name;
    const friendSkills = friendDetails?.skills;
    const friendProfilePic = friendDetails?.profilePic;
    const friendRef = dbRef(db, 'users/' + auth.currentUser?.uid + '/friends/' + Math.random().toString(36).substring(7));

    if (friendProfilePic) {
      const friendstorageRef = storageRef(storage, 'profilePics/' + friendProfilePic.name);
      await uploadBytes(friendstorageRef, friendProfilePic).catch((error) => {
        setError(error.message);
      });
      const profilePicUrl = await getDownloadURL(friendstorageRef).catch((error) => {
        setError(error.message);
      });

      set(friendRef, {
        name: friendName,
        skills: friendSkills,
        profilePic: profilePicUrl
      }).catch((error) => {
        setError(error.message);
      });
    } else {
      set(friendRef, {
        name: friendName,
        skills: friendSkills
      }).catch((error) => {
        setError(error.message);
      });
    }
  };
  

  useEffect(() => {
    const db = getDatabase();
    const profileRef = dbRef(db, 'users/' + auth.currentUser?.uid); // Replace 'username' with the current user's uid

    onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      setProfile(data);
    });
  }, []);

  if (!profile) {
    return <div className='main'>Loading...</div>;
  }

  return (
    <div className='mainProfile main'>
      <div className='container-main ProfileContainer'>
        <h1 className='profile-username'>Username: {profile.username}</h1>
        <p className='profile-interests'>Interests: {profile.interests}</p>
        {/* Display other profile data here */}
      </div>
      <div className='container-main FriendsContainer'>
        <p>Add friends</p>
        <div className='inputContainer'>
          <label htmlFor='name'>Name:</label>
          <input className='input' type='text' id='name' name='name' onChange={(e) => setFriendDetails(prevState => ({
              ...prevState,
              name: e.target.value,
              skills: prevState?.skills || '',
              profilePic: prevState?.profilePic || null
            }))} />
        </div>
        <div className='inputContainer'>
          <label htmlFor='interests'>Skills:</label>
          <select className='input' id='interests' name='interests' onChange={(e) => setFriendDetails(prevState => ({
              ...prevState,
              skills: e.target.value,
              name: prevState?.name || '',
              profilePic: prevState?.profilePic || null
            }))}>
            <option value="">Select an interest</option>
            <option value="cars">Cars</option>
            <option value="beauty">Beauty</option>
            <option value="technology">Technology</option>
            <option value="sports">Sports</option>
            {/* Add more interests as needed */}
          </select>
        </div>
        <div className='inputContainer'>
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
          <input type="file" id="profilePic" style={{display: 'none'}} onChange={(e) => {
              if(e.target.files && e.target.files.length > 0) {
                setFriendDetails(prevState => ({
                  ...prevState,
                  profilePic: e.target.files ? e.target.files[0] : null,
                  name: prevState?.name || '',
                  skills: prevState?.skills || ''
                }));
              }
            }
          } />
        </div>
        
        <div className='inputContainer'>
          {error && <p className="error">{error}</p>}
          <button onClick={handleFriendAdd}>Submit</button>
        </div>
        
        
        
      </div>
      
    </div>
  );
};

export default ProfileScreen