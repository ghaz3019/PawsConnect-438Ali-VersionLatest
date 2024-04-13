import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Edit = () => {
    const[profile, setProfile] = useState({
        PasswordHash:"",
        DisplayName:"",
        ProfilePictureURL:"",
        Location:"",
        PreferredLanguage:""
    });

    const navigate = useNavigate();
    const location = useLocation();
    const profID = location.pathname.split('/')[2];

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axios.get("http://localhost:8800/edit/"+profID);
            const user = response.data[0];

            setProfile({
              PasswordHash: user.PasswordHash,
              DisplayName: user.DisplayName,
              ProfilePictureURL: user.ProfilePictureURL,
              Location: user.Location,
              PreferredLanguage: user.PreferredLanguage
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        fetchUserData();
      }, [profID]); 

    const handleChange = (e) =>{
        setProfile(prev=>({...prev, [e.target.name]: e.target.value }));
    };

    const handleDelete = async e =>{
        try {
            await axios.delete("http://localhost:8800/edit/"+profID, profile)
            navigate("/");
        } catch(err) {
            console.log(err);
        }
    }

    const handleClick = async e =>{
        e.preventDefault()
        try {
            await axios.put("http://localhost:8800/edit/"+profID, profile)
            navigate("/");
        } catch(err) {
            console.log(err);
        }
    }

    console.log(profile)

    return (
        <div className='form'>
            <h1>Edit Profile</h1>
            <input 
                type="text" 
                placeholder='Password' 
                onChange={handleChange} 
                name="PasswordHash"
                value = {profile.PasswordHash || ""}
            />
            <input 
                type="text" 
                placeholder='Display Name' 
                onChange={handleChange}
                name="DisplayName"
                value = {profile.DisplayName || ""}
            />
            <input 
                type="text" 
                placeholder='Profile Picture URL' 
                onChange={handleChange} 
                name="ProfilePictureURL"
                value = {profile.ProfilePictureURL || ""}
            />
            <input 
                type="text" 
                placeholder='Location' 
                onChange={handleChange} 
                name="Location"
                value = {profile.Location || ""}
            />
            <input 
                type="text" 
                placeholder='Preferred Language' 
                onChange={handleChange} 
                name="PreferredLanguage"
                value = {profile.PreferredLanguage || ""}
            />
            <button className="formButton" onClick={handleClick}>Update Profile</button>
            <button className="delete" onClick={()=>handleDelete(profID)}>Delete</button>
        </div>
    )
}


export default Edit;