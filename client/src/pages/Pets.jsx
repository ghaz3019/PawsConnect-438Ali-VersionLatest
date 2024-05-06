import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pets = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await axios.get("http://localhost:8800/pets");
                setPets(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProfiles();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Meet Our Pets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.slice(0, 2).map((pet, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src={pet.ProfilePictureURL} alt={pet.Name} className="w-full h-64 object-cover object-center" />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{pet.Name}</h2>
                            <p className="text-gray-700 mb-2">{pet.Breed}</p>
                            <p className="text-gray-700 mb-2">{pet.Age} years old</p>
                            <p className="text-gray-700 mb-4">{pet.Color}</p>
                            <p className="text-gray-700">{pet.Description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pets;
