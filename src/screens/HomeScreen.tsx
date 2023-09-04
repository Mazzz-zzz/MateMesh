// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref as dbRef , onValue } from "firebase/database";
import { AuthContext } from '../App'; 
import { SearchForService } from "../components/SearchForService";
import { UserBox } from "../components/UserBox";
import "./HomeScreen.css";

interface User {
  id: string;
  profilePic?: string;
  name: string;
  skills: string;
}

const HomeScreen = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]); // All users
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const authContext = useContext(AuthContext);
  const auth = authContext ? authContext.currentUser : null;
  const db = getDatabase();

  const extractUserData = (key: string, friend: any): User => ({
    id: key,
    name: friend?.name ?? '',
    skills: friend?.skills ?? '',
    profilePic: friend?.profilePic,
  });

  

  // Fetch all users when the component mounts
  useEffect(() => {
    if (!auth) {
      console.log('User not authenticated');
      return;
    }
  
    const friendRef = dbRef(db, 'users/' + auth.uid + '/friends/');
    onValue(friendRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data)
      setUsers(Object.entries(data).map(([key, friend]) => extractUserData(key, friend)));
    });
  }, [auth]);

  // Update the filtered users when the users or the search term changes
  useEffect(() => {
    const filtered = users.filter(user => user.skills.includes(searchTerm));
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const handleSearch = (term: string) => {
    console.log(term)
    setSearchTerm(term);
  };

  return (
    <div className="home">
      <div className="header">
        <div className="text-wrapper-2">MateMesh</div>
        <SearchForService onSearch={handleSearch} />
      </div>
      <div /*className="user-box-2"*/>
        <UserBox users={filteredUsers}/>
      </div>
    </div>
  );
};

export default HomeScreen;