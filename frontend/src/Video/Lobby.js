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
    <Box p={4}>
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
        <Button type="submit" colorScheme="teal">
          Join
        </Button>
      </form>
    </Box>
  );
};

export default Lobby;

// import React, { useCallback, useState, useEffect } from "react";
// import { useSocket } from "./SocketProvider";
// import { useHistory } from "react-router-dom";
// import {
//   Box,
//   Heading,
//   FormControl,
//   FormLabel,
//   Input,
//   Button,
// } from "@chakra-ui/react";
// import Room from "./Room";

// const Lobby = () => {
//   const [email, setEmail] = useState("");
//   const [room, setRoom] = useState("");
//   const socket = useSocket();
//   const history = useHistory();

//   const handleSubmitForm = useCallback(
//     (e) => {
//       e.preventDefault();
//       socket.emit("room:join", { email, room });
//     },
//     [email, room, socket]
//   );

//   const handleJoinRoom = useCallback(
//     (data) => {
//       const { room } = data;
//       history.push(`/room/${room}`);
//     },
//     [history]
//   );

//   useEffect(() => {
//     socket.on("room:join", handleJoinRoom);
//     return () => {
//       socket.off("room:join", handleJoinRoom);
//     };
//   }, [socket, handleJoinRoom]);

//   return (
//     <Box p={4}>
//       <Heading as="h1" mb={4}>
//         Lobby
//       </Heading>
//       <form onSubmit={handleSubmitForm}>
//         <FormControl mb={4}>
//           <FormLabel htmlFor="email">E-mail ID</FormLabel>
//           <Input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             variant="flushed"
//             placeholder="Enter your name"
//           />
//         </FormControl>
//         <FormControl mb={4}>
//           <FormLabel htmlFor="room">Room Number</FormLabel>
//           <Input
//             type="text"
//             id="room"
//             value={room}
//             onChange={(e) => setRoom(e.target.value)}
//             variant="flushed"
//             placeholder="Enter room number"
//           />
//         </FormControl>
//         <Button type="submit" colorScheme="teal">
//           Join
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default Lobby;
