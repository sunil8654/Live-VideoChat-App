import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import './Lobby.css';

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const localVideoRef = useRef();
  const localAudioRef = useRef();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  useEffect(() => {
    // Get access to audio and video
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  }, []);

  return (
    <div className="container">
      <h1>Join Room</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted playsInline className="local-video"></video>
        <audio ref={localAudioRef} autoPlay muted className="local-audio"></audio>
      </div>
    </div>
  );
};

export default LobbyScreen;
