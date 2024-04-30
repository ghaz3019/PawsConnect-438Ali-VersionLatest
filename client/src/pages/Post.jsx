import React, { useState, useEffect } from "react";
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
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    fetchPetsByUserId(UserID).then(pets => {
      setPets(pets || []);
    });
  }, [UserID]);

  axios.defaults.withCredentials = true;

  const fetchPetsByUserId = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8800/pets/${userId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheck = (event) => {
    const isCheckbox = event.target.type === "checkbox";
    setPost({
      ...post,
      [event.target.name]: isCheckbox
        ? event.target.checked
        : event.target.value,
    });
  };

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPost((prevPost) => ({ ...prevPost, photo: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userID", post.userID);
    formData.append("caption", post.caption);
    formData.append("photo", post.photo);
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
      navigate("/profile/" + UserName);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a Post</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      {filePreview && (
        <img src={filePreview} alt="Preview" className="w-full mb-4" />
      )}
      <select
        multiple
        value={post.taggedPets}
        onChange={handleChange}
        name="taggedPets"
        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 mb-4"
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
        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 mb-4"
      />
      <label className="flex items-center">
        <input
          id="checkbox"
          type="checkbox"
          checked={post.visibility}
          onChange={handleCheck}
          name="visibility"
          className="mr-2"
        />
        Private
      </label>
      <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 mt-4" type="submit" onClick={handleClick}>
        Submit
      </button>
    </div>
  );
};

export default Post;
