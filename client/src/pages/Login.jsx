import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Button from "react-bootstrap/esm/Button";
import { GoogleLogin } from "@react-oauth/google";

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
        <div className='form'>
            <h1>Login Here</h1>
            <input 
                type="text" 
                placeholder='Username' 
                onChange={handleChange} 
                name="UserName"
            />
            <input 
                type="password" 
                placeholder='Password' 
                onChange={handleChange} 
                name="PasswordHash"
            />
            {loginError && <p style={{ color: "red" }}>{loginError}</p>}

            <div className="loginButtons">
                <Button variant="primary" onClick={handleClick}>Login</Button>
                <Button variant="secondary" onClick={handleGoBack}>Back</Button>
            </div>

            <div id="signInDiv"></div>

            <GoogleLogin
                className="google-login-button"
                buttonText="Sign Up with Google"
                onSuccess={responseGoogleSuccess}
                onFailure={responseGoogleFailure}
                cookiePolicy={'single_host_origin'}
            />

            {Object.keys(user).length !== 0 &&
                <button onClick={handleSignOut}>Sign Out</button>
            }
{/*             
            {user && 
                <div> 
                    <img src={user.picture} alt=""></img>
                    <h3>{user.name}</h3>
                </div>
            } */}
        </div>
    )
}

export default Login;
