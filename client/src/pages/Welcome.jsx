import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
    return (
        <div className="welcome">
            <h1>Welcome To PawsConnect!</h1>

            <div className="welcomeButtons">
                <button className="welcomeButton"><Link to={`/Login`}>Login</Link></button>
                <button className="welcomeSignupButton"><Link to={`/Signup`}>Not Registered? Signup Here</Link></button>
            </div>
            

        </div>
    )
}


export default Welcome;