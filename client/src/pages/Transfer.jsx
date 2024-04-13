import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

//used to confirm the transfer
function useConfirm(message, onConfirm, onAbort) {
  const confirm = () => {
    if (window.confirm(message)) onConfirm();
    else onAbort();
  };
  return confirm;
}

const Transfer = () => {
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [transferRequests, setTransferRequests] = useState([]);
  const [incomingTransferRequests, setIncomingTransferRequests] = useState([]);
  const OwnerID = useParams().UserID;

  useEffect(() => {
    const fetchTransferRequests = async () => {
      try {
        //fetch outgoing transfer requests and set state
        const response = await axios.get(
          `http://localhost:8800/fetchTransferRequests/${OwnerID}`
        );
        //console.log(response.data);
        setTransferRequests(response.data);
      } catch (error) {
        console.error("Error fetching transfer requests:", error);
      }
    };

    const fetchIncomingTransferRequests = async () => {
      try {
        //fetch incoming transfer requests and set state
        const response = await axios.get(
          `http://localhost:8800/fetchIncomingRequests/${OwnerID}`
        );
        //console.log(response.data);
        setIncomingTransferRequests(response.data);
      } catch (error) {
        console.error("Error fetching incoming requests:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        //fetch valid users to transfer to and set state
        const response = await axios.get(
          `http://localhost:8800/fetchTransferOptions/${OwnerID}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchPets = async () => {
      try {
        //fetch valid pets to transfer and set state
        const response2 = await axios.get(
          `http://localhost:8800/pets/${OwnerID}`
        );
        setPets(response2.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchTransferRequests();
    fetchIncomingTransferRequests();
    fetchPets();
    fetchUsers();
  }, [OwnerID]);

  const handleClick = async () => {
    //grab the selected pet and user to trander to
    const transferPetOptions =
      document.getElementsByName("transferPetOptions")[0].value;
    const transferUserOptions = document.getElementsByName(
      "transferUserOptions"
    )[0].value;

    const pet = pets.find((pet) => pet.Name === transferPetOptions);
    const user = users.find((user) => user.UserName === transferUserOptions);

    if (!pet || !user) {
      console.error("Pet or user not found");
      return;
    }
    console.log(
      "Pet:" + pet.PetID + " Transfer User:" + user.UserID + " Owner:" + OwnerID
    );
    try {
      //send transfer request using pet and user grabbed earlier to index.js
      const response = await axios.post(
        `http://localhost:8800/transferPetRequest/${pet.PetID}/${user.UserID}/${OwnerID}`
      );
      console.log(response.data);
      alert("Pet transfer request sent");
      window.location.reload();
    } catch (error) {
      alert("Pet already has active transfer request!");
      console.error("Error transferring pet:", error);
    }
  };

  //handle confirmation logic
  const handleTransfer = () => {
    handleClick();
  };
  const handleAbort = () => {
    console.log("Aborted");
  };
  const confirmTransfer = useConfirm(
    "Are you sure you want to transfer?",
    handleTransfer,
    handleAbort
  );

  const handleAccept = async (transferID) => {
    try {
      //send accept transfer request using transferID to index.js
      const response = await axios.put(
        `http://localhost:8800/acceptTransferRequest/${transferID}`
      );
      console.log(response.data);
      alert("Transfer request accepted");
      window.location.reload();
    } catch (error) {
      console.error("Error accepting transfer request:", error);
    }
  };
  const handleDeny = async (transferID) => {
    try {
      //send deny transfer request using transferID to index.js
      const response = await axios.delete(
        `http://localhost:8800/denyTransferRequest/${transferID}`
      );
      console.log(response.data);
      alert("Transfer request denied");
      window.location.reload();
    } catch (error) {
      console.error("Error denying transfer request:", error);
    }
  };

  return (
    <div className="form">
      <h1>Pet Transfer</h1>
      <div>
        <h3>Pending Outgoing Requests</h3>
        {transferRequests.map((request) => (
          <div key={request.transferID}>
            <p>
              Transferring Pet <strong>{request.Name} ID:</strong>{" "}
              <strong>{request.PetID}</strong> To{" "}
              <strong>{request.DisplayName} ID:</strong>
              <strong>{request.UserID}</strong>
            </p>
          </div>
        ))}
      </div>
      <hr />
      <div>
        <h3>Pending Incoming Requests</h3>
        {incomingTransferRequests.map((request) => (
          <div
            key={request.transferID}
            style={{ display: "flex", alignItems: "center" }}
          >
            <p>
              Transfer Request From <strong>{request.OwnerName} ID:</strong>
              <strong>{request.OwnerID}</strong> For{" "}
              <strong>{request.Name} ID:</strong>{" "}
              <strong>{request.PetID} </strong>
            </p>
            <button
              onClick={() => handleAccept(request.transferID)}
              style={{ marginRight: "10px", marginLeft: "10px" }}
            >
              Accept
            </button>
            <button onClick={() => handleDeny(request.transferID)}>Deny</button>
          </div>
        ))}
      </div>
      <hr />
      <label>
        Transfer Pet:
        <select name="transferPetOptions">
          {pets.map((pet) => (
            <option key={pet.PetID}>{pet.Name}</option>
          ))}
        </select>
      </label>
      <label>
        Transfer to:
        <select name="transferUserOptions">
          {users.map((user) => (
            <option key={user.UserID}>{user.UserName}</option>
          ))}
        </select>
      </label>
      <button className="formButton" type="submit" onClick={confirmTransfer}>
        Submit
      </button>
    </div>
  );
};

export default Transfer;
