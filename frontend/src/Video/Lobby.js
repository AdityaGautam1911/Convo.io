import React, { useCallback, useState, useEffect } from "react";
import { useSocket } from "./SocketProvider";
import { useHistory } from "react-router-dom";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  console.log("this is socket object on lobby page");
  const socket = useSocket();
  console.log(socket);
  const history = useHistory();

  const handleSubmitform = useCallback(
    (e) => {
      e.preventDefault();
      console.log({ email, room });
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      console.log(email, room);
      history.push(`/room/&{room}`);
    },
    [history]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitform}>
        <label htmlFor="email">E-mail ID</label>
        <input
          style={{ backgroundColor: "pink" }}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room Number</label>
        <input
          style={{ backgroundColor: "pink" }}
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </div>
  );
};

export default Lobby;
