import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Translate from "./Translate";

const Profile = () => {
    const [profile, setProfile] = useState([{ UserName: 'Ali' }]);

    const location = useLocation();
    const profName = location.pathname.split('/')[2];

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await axios.get("http://localhost:8800/profile/" + profName)
                console.log(res)
                setProfile(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchProfiles()
    }, [profName]);

    return (
        // <div>
        //     <h1>Profile Page</h1>
        //     <div className="profile">
        //         {profile.map(profileInfo => (
        //             <div className="profileInfo" key={profileInfo.UserID}>
        //                 {profileInfo.ProfilePictureURL && <img src={profileInfo.ProfilePictureURL} alt="" />}
        //                 <h2>Username: {profileInfo.UserName}</h2>
        //                 <p>Display Name: {profileInfo.DisplayName}</p>
        //                 <p>Location: {profileInfo.Location}</p>
        //                 <p>Preferred Language: {profileInfo.PreferredLanguage}</p>
        //                 <button className="edit"><Link to={`/edit/${profileInfo.UserID}`}>Edit Profile</Link></button>
        //                 <button className="post">
        //                     <Link to={`/post/${profileInfo.UserName}/${profileInfo.UserID}`}>Create Post</Link>
        //                 </button>
        //             </div>
        //         ))}
        //     </div>
        // </div>
        <>


            <div className='flex flex-col items-center border'>


                <div className='bg-white relative w-[800px] h-[450px] my-10 border-2'>

                    {profile.map((e) => {

                        return (
                            <>
                                <div className='h-[60%]'><img className='w-[100%] h-[100%] rounded-none' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSnfBD8oiQixFsc59ccAI4fSbIBvvTjUEZuw&usqp=CAU" /></div>
                                <div className='h-[100%]  absolute top-0 p-16 flex justify-center items-center'>
                                    <div className=' h-[150px] w-[150px] border-4 border-white overflow-hidden rounded-full'><img src={e.ProfilePictureURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ISC9UU8aZv3dBBEAc23t4mzgdkPLVgpdk2ClCRapGw&s"} alt="" className='h-[100%] w-[100%]' /></div>
                                </div>
                                <div className='mt-10   w-[300px] flex flex-col items-center'>
                                    <span className=' font-bold text-xl'>{e.UserName}</span>
                                    <div className='flex px-5 mt-2'>
                                        <span className='mx-1 text-xs'>{e.PreferredLanguage} </span>
                                        <span className='mx-1 text-xs'> Country</span>
                                        <span className='mx-1 text-sm text-blue-600  cursor-pointer font-bold  relative z-4000'  >Contact Info</span>
                                    </div>




                                </div>

                                <div className=" my-10  relative z-10000">
                                    <button className="edit"><Link to={`/edit/${e.UserID}`}>Edit Profile</Link></button>
                                    <button className="post mx-5">
                                        <Link to={`/post/${e.UserName}/${e.UserID}`}>Create Post</Link>
                                    </button>
                                    <button className="post mx-5 bg-blue-600 w-[150px] p-2 rounded-md text-white font-bold">
                                        <Link to={`/pets`} className="text-white">Pets Profile</Link>
                                    </button>
                                    <button className="post mx-5 bg-blue-600 w-[150px] p-2 rounded-md text-white font-bold">
                                        <Link to={`/translation`} className="text-white">Translation</Link>
                                    </button>
                                </div>
                            </>
                        )
                    })}


                </div>


            </div>

            {/* <Translate /> */}

        </>


    );
}


export default Profile;