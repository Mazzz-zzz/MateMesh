// src/components/UserBox.tsx
import React from "react";
import "./UserBox.css";

interface User {
  id: string;
  profilePic?: string;
  name: string;
  skills: string;
}

interface UserBoxProps {
  users: User[];
}

export const UserBox = ({ users }: UserBoxProps): JSX.Element => {
  return (
    <div className="grid-container">
      {users.map(user => (
        <div className="friend-container" key={user.id}>
          <img 
            src={user.profilePic || 'default-profile-pic-url'} 
            alt={user.name} 
            className="friend-profile-pic"
          />
          <div className="friend-details">
            <h2>{user.name}</h2>
            <p>{user.skills}</p>
          </div>
        </div>
      ))}
    </div>
  );
};