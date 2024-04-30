import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Edit = () => {
    const [profile, setProfile] = useState({
        PasswordHash: "",
        DisplayName: "",
        ProfilePictureURL: "",
        Location: "",
        PreferredLanguage: ""
    });

    const navigate = useNavigate();
    const location = useLocation();
    const profID = location.pathname.split('/')[2];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:8800/edit/" + profID);
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

    const handleChange = (e) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDelete = async e => {
        try {
            await axios.delete("http://localhost:8800/edit/" + profID, profile)
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    }

    const handleClick = async e => {
        e.preventDefault()
        try {
            await axios.put("http://localhost:8800/edit/" + profID, profile)
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen ">
            <div className="max-w-md w-full  p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>
                <div className="space-y-4">
                    {/* <div>
                        <label htmlFor="" className="my-1 font-bold">Username :</label>
                        <input
                            type="text"
                            placeholder="Display Name"
                            onChange={handleChange}
                            name="DisplayName"
                            value={profile.DisplayName || ""}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div> */}
                    <div>
                        <label htmlFor="" className="my-1 font-bold">Password :</label>
                        <input
                            type="text"
                            placeholder="Password"
                            onChange={handleChange}
                            name="PasswordHash"
                            value={profile.PasswordHash || ""}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="" className="my-1 font-bold">URL:</label>
                        <input
                            type="text"
                            placeholder="Profile Picture URL"
                            onChange={handleChange}
                            name="ProfilePictureURL"
                            value={profile.ProfilePictureURL || ""}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="" className="my-1 font-bold">City :</label>
                        <input
                            type="text"
                            placeholder="Location"
                            onChange={handleChange}
                            name="Location"
                            value={profile.Location || ""}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="" className="my-1 font-bold">Language :</label>
                        <input
                            type="text"
                            placeholder="Preferred Language"
                            onChange={handleChange}
                            name="PreferredLanguage"
                            value={profile.PreferredLanguage || ""}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button onClick={handleClick} className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Update Profile</button>
                    <button onClick={() => handleDelete(profID)} className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default Edit;
