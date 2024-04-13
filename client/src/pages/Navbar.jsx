import React, { useEffect, useState } from 'react'
import axios from "axios";


const Navbar = () => {



    const [Search, setsearch] = useState('')
    const [oncl, setoncl] = useState('')
    const [hide, sethide] = useState(false)
    const [users, setuser] = useState([])
    const fetchProfiles = async () => {

        try {
            const res = await axios.get("http://localhost:8800/all")
            console.log(res)
            setuser(res.data);
        } catch (err) {
            console.log(err);
        }
    }
    let filteraa;
    const handle = () => {
        if (Search === '') alert('Enter anything')
        else sethide(true)
        setoncl(Search)
        filteraa = users.filter((e) => e.UserName === oncl)
        console.log(filteraa)
    }
    useEffect(() => {

        fetchProfiles()
        console.log(users)

    }, [])

    return (
        <>
            <div className='p-4 flex justify-end bg-slate-100'>
                <input type="text" name="" id="" placeholder='Search User Here ...' value={Search} className='border-1 outline-none w-[220px] p-2 px-4  rounded-3xl ' onChange={(e) => setsearch(e.target.value)} />
                <button className='rounded-3xl w-[120px] p-2 border-2 bg-blue-400 text-white' onClick={handle}>Search</button>

            </div>




            <div className={`absolute w-[100%] h-[70%]  z-10 justify-center items-center ${hide ? 'flex' : 'hidden'}`} >

                <div className=' bg-slate-100 w-[400px] rounded-xl'>
                    <div className='flex justify-end text-xl relative -top-[0.5rem] -right-[0.3rem] cursor-pointer'><span className='rounded-full bg-black p-1' onClick={() => sethide(false)}>❌</span></div>
                    <div className='p-[30px]'>
                        {
                            users ?


                                users?.filter((e) => e.UserName === oncl).map((e) => {
                                    return (
                                        <>

                                            <div className='flex'>                                        <div className='h-[70px] w-[70px] rounded-full'>
                                                <img src={e.ProfilePictureURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ISC9UU8aZv3dBBEAc23t4mzgdkPLVgpdk2ClCRapGw&s"} alt="" className='h-[100%] w-[100%]' /></div>
                                                <div className='flex-col mx-[30px]'>
                                                    <p className='font-semibold'>{e.UserName}</p>
                                                    <p>{e.DisplayName}</p>
                                                </div>
                                                <div>
                                                    {e.PreferedLanguage && <span><p className='font-semibold'>Language :</p> {e.PreferedLanguage}</span>}
                                                    <span>Location : {e.Location}</span>
                                                </div>
                                            </div>

                                        </>
                                    )
                                })
                                :
                                <p>NO user</p>
                        }


                    </div>


                </div>

            </div>
        </>
    )
}

export default Navbar
