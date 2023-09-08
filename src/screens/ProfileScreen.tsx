import React, { useEffect, useState, useContext } from 'react';
import { getDatabase, ref as dbRef , onValue, set } from "firebase/database";
import { getStorage, uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage"
import { AuthContext } from '../App'; 
import './ProfileScreen.css';
import { AddSources } from '../components/AddSources';



const ProfileScreen = (): JSX.Element => {
  const [profile, setProfile] = useState<{username: string, interests: string} | null>(null);
  const [friendDetails, setFriendDetails] = useState<{name: string, skills: string, profilePic: File | null} | null>(null);
  
  const authContext = useContext(AuthContext);
  const auth = authContext ? authContext.currentUser : null;
  const [error, setError] = useState<string | null>(null);
  const storage = getStorage();

  const handleFriendAdd = async () => {
    const db = getDatabase();
    const friendName = friendDetails?.name;
    const friendSkills = friendDetails?.skills;
    const friendProfilePic = friendDetails?.profilePic;
    const friendRef = dbRef(db, 'users/' + auth?.uid + '/friends/' + Math.random().toString(36).substring(7));

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
    const profileRef = dbRef(db, 'users/' + auth?.uid); // Replace 'username' with the current user's uid

    onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      setProfile(data);
    });
  }, [auth]);

  if (!profile) {
    return <div className='main'>Loading...</div>;
  }

  return (
    <div className='mainProfile main'>
      <div className='container-main ProfileContainer'>
        <h1>About me</h1>
        <p className='profile-username'>Username: {profile.username}</p>
        <p className='profile-interests'>Interests: {profile.interests}</p>
        {/* Display other profile data here */}
      </div>
      <div className='container-main FriendsContainer'>
        <h1>Add friends</h1>
        <div className='inputContainer addfriends'>
          <label htmlFor='name'>Name:</label>
          <input className='input' type='text' id='name' name='name' onChange={(e) => setFriendDetails(prevState => ({
              ...prevState,
              name: e.target.value,
              skills: prevState?.skills || '',
              profilePic: prevState?.profilePic || null
            }))} />
        </div>
        <div className='inputContainer addfriends'>
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
      <div>
        <AddSources ></AddSources>
      </div>
    </div>
  );
};

export default ProfileScreen