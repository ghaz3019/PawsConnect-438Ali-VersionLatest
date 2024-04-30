import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Button from "react-bootstrap/esm/Button";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

const Login = () => {
    const [user, setUser] = useState({});

    function handleCallbackResponse(response) {
        var userObject = jwtDecode(response.credential);
        setUser(userObject);
        document.getElementById("signInDiv").hidden = true;
    }

    function handleSignOut(event) {
        setUser({});
        document.getElementById("signInDiv").hidden = false;
    }

    useEffect(() => {
        const google = window.google;
        if (google && google.accounts && google.accounts.id) {
            google.accounts.id.initialize({
                client_id: "YOUR_CLIENT_ID_HERE",
                callback: handleCallbackResponse
            });

            google.accounts.id.renderButton(
                document.getElementById("signInDiv"),
                { theme: "outline", size: "large" }
            );

            google.accounts.id.prompt();
        } else {
            console.error("Google Sign-In API is not properly loaded or initialized.");
        }
    }, []);

    const [loginData, setLoginData] = useState({
        UserName: "",
        PasswordHash: ""
    });

    const [loginError, setLoginError] = useState(null);
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }

    const handleChange = (e) => {
        setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async () => {
        if (loginData.UserName === "" || loginData.PasswordHash === "") {
            setLoginError("Please fill in both username and password.");
            return;
        } else {
            setLoginError("");
        }

        axios.post("http://localhost:8800/api/login", loginData)
            .then(res => {
                console.log(res.data.LoggedIn)
                if (res.data.LoggedIn) {
                    navigate("/profile/" + loginData.UserName);
                } else {
                    setLoginError("Invalid login. Please try again");
                }
            })
            .catch(err => console.log(err));
    }

    const responseGoogleSuccess = (response) => {
        console.log(response);
        // Handle successful Google login here
    };

    const responseGoogleFailure = (response) => {
        console.error(response);
        // Handle failed Google login here
    };

    return (
        // <div className='form'>
        //     <h1>Login Here</h1>
        //     <input
        //         type="text"
        //         placeholder='Username'
        //         onChange={handleChange}
        //         name="UserName"
        //     />
        //     <input
        //         type="password"
        //         placeholder='Password'
        //         onChange={handleChange}
        //         name="PasswordHash"
        //     />
        //     {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        //     <div className="loginButtons">
        //         <Button variant="primary" onClick={handleClick}>Login</Button>
        //         <Button variant="secondary" onClick={handleGoBack}>Back</Button>
        //     </div>

        //     <div id="signInDiv"></div>

        //     <GoogleLogin
        //         className="google-login-button"
        //         buttonText="Sign Up with Google"
        //         onSuccess={responseGoogleSuccess}
        //         onFailure={responseGoogleFailure}
        //         cookiePolicy={'single_host_origin'}
        //     />

        //     {Object.keys(user).length !== 0 &&
        //         <button onClick={handleSignOut}>Sign Out</button>
        //     }
        //     {/*             
        //     {user && 
        //         <div> 
        //             <img src={user.picture} alt=""></img>
        //             <h3>{user.name}</h3>
        //         </div>
        //     } */}
        // </div>

        <div className=' bg-gray-100 top-0 left-0 w-[100%] h-[120vh]  z-10 absolute'>

            <div class="text-center mt-10">
                <div class="flex items-center justify-center">
                    <svg fill="none" viewBox="0 0 24 24" class="w-12 h-12 text-blue-500" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 class="sm:text-4xl text-2xl tracking-tight">
                    Sign in into your account
                </h2>
                <span class="text-sm">or <Link to={'/signup'} class="text-blue-500">
                    register a new account
                </Link>
                </span>
            </div>
            <div class="flex justify-center my-2 mx-4 md:mx-0">
                <div class="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
                    <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full md:w-full px-3 mb-6">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for='Password'>UserName </label>
                            <input className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" name="UserName" type='text' onChange={handleChange} />
                            {/* <input type="text" placeholder='Username' onChange={handleChange} name="UserName" */}
                            {/* /> */}
                        </div>
                        <div class="w-full md:w-full px-3 mb-6">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for='Password'>Password</label>
                            <input class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" name="PasswordHash" type='password' onChange={handleChange} />
                            {/* <input
                                type="password"
                                placeholder='Password'
                                onChange={handleChange}
                                name="PasswordHash"
                            /> */}
                        </div>
                        {/* <div class="w-full flex items-center justify-between px-3 mb-3 ">
                            <label for="remember" class="flex items-center w-1/2">
                                <input type="checkbox" name="" id="" class="mr-1 bg-white shadow" />
                                <span class="text-sm text-gray-700 pt-1">Remember Me</span>
                            </label>

                        </div> */}
                        {loginError && <p style={{ color: "red" }}>{loginError}</p>}


                        <div className="w-full md:w-full px-3 mb-6 sm:mt-10">
                            <Button className="appearance-none block w-full bg-blue-600 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none focus:bg-white focus:border-gray-500" onClick={handleClick}>Login</Button>
                            <Button className=" mt-10 appearance-none block w-full bg-blue-500 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none focus:bg-white focus:border-gray-500" onClick={handleGoBack}>Back</Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
