import React, { useCallback, useState, useEffect } from "react";
import { useSocket } from "./SocketProvider";
import { useHistory } from "react-router-dom";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const history = useHistory();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log("Form submitted with email:", email, "and room:", room);
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      console.log("Joining room with data:", data);
      const { room } = data;
      history.push(`/room/${room}?email=${email}`);
    },
    [history, email]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <Box
      p={4}
      bg="linear-gradient(184deg, rgba(188,188,188,1) 0%, rgba(217,185,155,1) 100%)"
      color="black"
      borderRadius="5px"
      textAlign="center"
    >
      <Heading as="h1" mb={4}>
        Lobby
      </Heading>
      <form onSubmit={handleSubmitForm}>
        <FormControl mb={4}>
          <FormLabel htmlFor="email">User Name</FormLabel>
          <Input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="flushed"
            placeholder="Enter your name"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor="room">Room Number</FormLabel>
          <Input
            type="text"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            variant="flushed"
            placeholder="Enter room number"
          />
        </FormControl>
        <Button
          type="submit"
          bg="linear-gradient(184deg, rgba(183,183,183,1) 0%, rgba(125,114,93,1) 100%)"
          margin="auto"
          display="block"
          width="100%"
        >
          Join
        </Button>
      </form>
    </Box>
  );
};

export default Lobby;
