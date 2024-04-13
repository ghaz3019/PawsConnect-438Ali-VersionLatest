import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Post = () => {
  const navigate = useNavigate();
  const UserName = useParams().UserName;
  const UserID = useParams().UserID;

  const [post, setPost] = useState({
    userID: UserID,
    caption: "",
    photo: null,
    visibility: false,
    taggedPets: [],
  });

  const [pets, setPets] = useState([]);

    useEffect(() => {
        fetchPetsByUserId(UserID).then(pets => {
            setPets(pets || []);
        });
    }, [UserID]);

    axios.defaults.withCredentials = true;

  const fetchPetsByUserId = async (userId) => {
    try {
      //fetch valid pets to tag to poulate dropdown menu
      const response = await axios.get(`http://localhost:8800/pets/${userId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  //handler for checkbox
  const handleCheck = (event) => {
    const isCheckbox = event.target.type === "checkbox";
    setPost({
      ...post,
      [event.target.name]: isCheckbox
        ? event.target.checked
        : event.target.value,
    });
  };

  //handler for rest of input fields
  const handleChange = (event) => {
    const { name, value, options } = event.target;

    if (name === "taggedPets") {
      const selectedPets = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setPost((prevPost) => ({ ...prevPost, [name]: selectedPets }));
    } else {
      setPost((prevPost) => ({ ...prevPost, [name]: value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    //have to use FormData to properly handle file uploads, essentially just another ~req.body~
    const formData = new FormData();
    formData.append("userID", post.userID);
    formData.append("caption", post.caption);
    formData.append("photo", post.photo); // 'photo' is the key that the server will use to access the file
    formData.append("visibility", post.visibility);
    formData.append("taggedPets", post.taggedPets.join(", "));
    try {
      const postResponse = await axios.post(
        `http://localhost:8800/post/${UserName}/${UserID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(postResponse.data);
      navigate("/profile/" + UserName);
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleFileChange = (event) => {
    setPost((prevPost) => ({ ...prevPost, photo: event.target.files[0] }));
  };

  return (
    <div className="form">
      <h1>Create a Post</h1>
      <input type="file" onChange={handleFileChange} />
      <select
        multiple
        value={post.taggedPets}
        onChange={handleChange}
        name="taggedPets"
      >
        {pets.map((pet) => (
          <option key={pet.PetID} value={pet.Name}>
            {pet.Name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Caption"
        value={post.caption}
        onChange={handleChange}
        name="caption"
      />
      <label>
        Private?
        <input
          id="checkbox"
          type="checkbox"
          checked={post.visibility}
          onChange={handleCheck}
          name="visibility"
        />
      </label>
      <button className="formButton" type="submit" onClick={handleClick}>
        Submit
      </button>
    </div>
  );
};

export default Post;
