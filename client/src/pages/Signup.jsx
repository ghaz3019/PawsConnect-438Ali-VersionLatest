import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Signup = () => {

    // Sets the profile object that will be sent to the backend for proccessing.
    const[profile, setProfile] = useState({
        UserName:"",
        PasswordHash:"",
        DisplayName:"",
        ProfilePictureURL:"",
        Location:"",
        PreferredLanguage:""
    });

    // useState hooks that show a modal went prompt and present any errors
    // made by the user when going through the signup process.
    const [showModal, setShowModal] = useState(false);
    const [signupError, setSignupError] = useState(null);

    // useNavigate function that redirects the webpage to another route when prompted.
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };
    

    // Updates the profile object as fields take input from the user.
    const handleChange = (e) => {
        setProfile(prev=>({...prev, [e.target.name]: e.target.value }));
    };

    // Updates ProfilePictureURL field in profile object when a user populates file input.
    const handleFileChange = (event) => {
        setProfile({
            ...profile,
            ProfilePictureURL: event.target.files[0]
        });
    }

    // Sets the secondary password field that the user must fill in
    // to confirm the password they enter.
    const [confirmPassword, setConfirmPassword] = useState('');

    // Updates the confirmPassword object as the user fills in the field.
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    // Function that executes when the user presses the Signup button.
    const handleClick = (e) => {
        e.preventDefault();

        // Checks if any field is blank
        if (!profile.UserName || !profile.PasswordHash || !profile.DisplayName || !profile.ProfilePictureURL || !profile.Location || !profile.PreferredLanguage) {
            setSignupError("Please fill in all fields.");
            return;
        }

        // Checks if passwords match
        if (profile.PasswordHash !== confirmPassword) {
            setSignupError("Passwords must match.");
            return;
        }

        // Since we checked that all the fields are populated, we clear the signup
        // error message and show a modal for further confirmation from the user.
        setSignupError("");
        setShowModal(true);
    }

    // Function that executes when the user clicks confirm in the modal.
    const handleConfirm = () => {
        // Create a FormData instance to send to backend
        const formData = new FormData();
        Object.keys(profile).forEach(key => {
            formData.append(key, profile[key]);
        });

        // First, we send the UserName to the backend and verify that it is a
        // unique username, as these must be unique to be in the database.
        axios.get('http://localhost:8800/check-username/' + profile.UserName)
          .then(response => {
            if (response.data.exists) {
                // If we get a response from this query we know there is a user with
                // the same username in the database. So, we show an error message to the user.
                console.log('Username already exists');
                setShowModal(false);
                alert("Username is already taken. Please try a different username.");
            } else {
                // Otherwise we know the username does not exist and we are safe to add
                // this newly created user to our database. We then proceed with the signup.
                axios.post("http://localhost:8800/signup", formData, {
                    headers: {
                        'Content-Type' : 'multipart/form-data'
                    }
                })
                    .then(signupResponse => {
                        // We sign the user up and redirect them back to the root so they can
                        // login using their newly created account.
                        console.log(signupResponse);
                        navigate("/");
                    })
                    // Catch any errors within our insertion query and log them.
                    .catch(err => {
                        console.log(err);
                    });
            }
          })
          // Catch any errors with our username verification query and log them.
          .catch(error => console.log(error));
    }

    console.log(profile)

    // Returns the HTML for the webpage and references to above logic.
    return (
        <body className="signup-body">
        <div className='form'>
            <h1>Create a New Profile</h1>
            <div className="form-group">
                <label>Username:</label>
                <input 
                    type="text"
                    className="form-control" 
                    placeholder='Username' 
                    onChange={handleChange} 
                    name="UserName"
                />
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input 
                    type="password" 
                    className="form-control"
                    placeholder='Password' 
                    onChange={handleChange} 
                    name="PasswordHash"
                />
            </div>
            <div className="form-group">
                <label>Confirm Password:</label>
                <input 
                    type="password" 
                    className="form-control"
                    placeholder='Confirm Password'
                    onChange={handleConfirmPasswordChange} 
                    name="PasswordConfirm"
                />
            </div>
            <div className="form-group">
                <label>Display Name:</label>
                <input 
                    type="text" 
                    className="form-control"
                    placeholder='Display Name' 
                    onChange={handleChange}
                    name="DisplayName"
                />
            </div>
            <div className="form-group">
                <label>Profile Picture:</label>
                <input 
                    type="file"
                    className="form-control-file"
                    onChange={handleFileChange} 
                    name="ProfilePictureURL"
                />
            </div>
            <div className="form-group">
                <label>Location:</label>
                <input 
                    type="text" 
                    className="form-control"
                    placeholder='Location' 
                    onChange={handleChange} 
                    name="Location"
                />
            </div>
            <div className="form-group">
                <label>Preferred Language:</label>
                <select 
                    className="form-control"
                    onChange={handleChange} 
                    name="PreferredLanguage"
                >
                    <option value="">Select...</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Italian">Italian</option>
                </select>
            </div>
            <div>
                <div className="signUpButtons">
                    {/* Modal that prompts the user to confirm their sign up. */}
                    <Button variant="primary" onClick={handleClick}>Signup</Button>
                    <Button variant="secondary" onClick={handleGoBack}>Back</Button>
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Signup</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to sign up with these details?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleConfirm}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {signupError && <p style={{ color: "red" }}>{signupError}</p>}
    </div>
    </body>
    )
}


export default Signup;