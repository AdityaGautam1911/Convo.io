import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";
import ReactPlayer from "react-player";
import Peer from "./Peer";
import { Box, Button, Heading, Flex, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import { PhoneIcon } from "@chakra-ui/icons";

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const location = useLocation(); // Get the location object
  const email = new URLSearchParams(location.search).get("email"); // Extract the email from the URL

  // Function to handle user joining
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  // Function to call a user
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);

    const offer = await Peer.getOffer();
    console.log("Sending offer:", offer);
    if (remoteSocketId && offer) {
      socket.emit("user:call", { to: remoteSocketId, offer });
    } else {
      console.error("No remote socket ID or offer is invalid");
    }
  }, [remoteSocketId, socket]);

  // Function to handle incoming call
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);

      console.log(`Incoming Call from ${from}`, offer);
      if (offer) {
        const ans = await Peer.getAnswer(offer);
        console.log("Sending answer:", ans);
        socket.emit("call:accepted", { to: from, ans });
      } else {
        console.error("Received offer is invalid");
      }
    },
    [socket]
  );

  // Function to handle final negotiation need
  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await Peer.setLocalDescription(ans);
  }, []);

  // Function to send streams
  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      Peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  // Function to handle call accepted
  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      console.log("Received answer:", ans);
      Peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  // Function to handle negotiation needed
  const handleNegoNeeded = useCallback(async () => {
    const offer = await Peer.getOffer();
    if (remoteSocketId && offer) {
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    } else {
      console.error("No remote socket ID or offer is invalid");
    }
  }, [remoteSocketId, socket]);

  // Function to handle incoming negotiation need
  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      if (!offer) {
        console.error("Received invalid offer:", offer);
        return;
      }
      const ans = await Peer.getAnswer(offer);
      console.log("Sending answer:", ans);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  // Effect to handle negotiation needed event
  useEffect(() => {
    console.log("Peer object:", Peer);
    Peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      Peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  // Effect to handle track event
  useEffect(() => {
    Peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  // Effect to set up socket event listeners
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedFinal,
    handleNegoNeedIncoming,
  ]);

  // Render the Room component UI
  return (
    <Box p={4}>
      <Heading as="h1" size="lg" textAlign="center" mb={4}>
        Video Chat Room
      </Heading>
      <Flex justifyContent="center" alignItems="center" mb={4}>
        <Box textAlign="center" mr={4}>
          <Heading as="h3" size="md" mb={2}>
            {email}'s Stream
          </Heading>
          <Box
            border="1px solid #ccc"
            borderRadius="md"
            overflow="hidden"
            width="400px"
            height="300px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg={
              !myStream
                ? "linear-gradient(25deg, rgba(77,77,77,1) 0%, rgba(217,185,155,1) 100%)"
                : "transparent"
            }
          >
            {myStream ? (
              <ReactPlayer
                playing
                volume={1}
                height="100%"
                width="100%"
                url={myStream}
              />
            ) : (
              <Text>Waiting for your stream...</Text>
            )}
          </Box>
        </Box>
        <Box textAlign="center">
          <Heading as="h3" size="md" mb={2}>
            Remote Stream
          </Heading>
          <Box
            border="1px solid #ccc"
            borderRadius="md"
            overflow="hidden"
            width="400px"
            height="300px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg={
              !remoteStream
                ? "linear-gradient(25deg, rgba(77,77,77,1) 0%, rgba(217,185,155,1) 100%)"
                : "transparent"
            }
          >
            {remoteStream ? (
              <ReactPlayer
                playing
                volume={1}
                height="100%"
                width="100%"
                url={remoteStream}
              />
            ) : (
              <Text>Waiting for remote stream...</Text>
            )}
          </Box>
        </Box>
      </Flex>
      <Flex justifyContent="center" alignItems="center">
        <Button
          onClick={sendStreams}
          // disabled={!myStream}
          variant="solid"
          bg="#887d69"
          mr={4}
        >
          Share Your Video
        </Button>
        <Button
          onClick={handleCallUser}
          // disabled={!remoteSocketId}
          variant="solid"
          colorScheme="green"
        >
          Call <PhoneIcon ml={2} />
        </Button>
      </Flex>
    </Box>
  );
};

export default Room;

// import React, { useCallback, useEffect, useState } from "react";
// import { useSocket } from "./SocketProvider";
// import ReactPlayer from "react-player";
// import Peer from "./Peer";
// import {
//   Box,
//   Button,
//   Heading,
//   Flex,
//   Text,
//   useBreakpointValue,
// } from "@chakra-ui/react";
// import { useLocation } from "react-router-dom";
// import { PhoneIcon } from "@chakra-ui/icons";

// const Room = ({ roomId }) => {
//   const socket = useSocket();
//   const [remoteSocketId, setRemoteSocketId] = useState(null);
//   const [myStream, setMyStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);

//   const location = useLocation();
//   const email = new URLSearchParams(location.search).get("email");

//   const handleUserJoined = useCallback(({ email, id }) => {
//     console.log(`Email ${email} joined room`);
//     setRemoteSocketId(id);
//   }, []);

//   const handleCallUser = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     setMyStream(stream);

//     const offer = await Peer.getOffer();
//     console.log("Sending offer:", offer);
//     if (remoteSocketId && offer) {
//       socket.emit("user:call", { to: remoteSocketId, offer });
//     } else {
//       console.error("No remote socket ID or offer is invalid");
//     }
//   }, [remoteSocketId, socket]);

//   const handleIncomingCall = useCallback(
//     async ({ from, offer }) => {
//       setRemoteSocketId(from);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setMyStream(stream);

//       console.log(`Incoming Call from ${from}`, offer);
//       if (offer) {
//         const ans = await Peer.getAnswer(offer);
//         console.log("Sending answer:", ans);
//         socket.emit("call:accepted", { to: from, ans });
//       } else {
//         console.error("Received offer is invalid");
//       }
//     },
//     [socket]
//   );

//   const handleNegoNeedFinal = useCallback(async ({ ans }) => {
//     await Peer.setLocalDescription(ans);
//   }, []);

//   const sendStreams = useCallback(() => {
//     for (const track of myStream.getTracks()) {
//       Peer.peer.addTrack(track, myStream);
//     }
//   }, [myStream]);

//   const handleCallAccepted = useCallback(
//     ({ from, ans }) => {
//       console.log("Received answer:", ans);
//       Peer.setLocalDescription(ans);
//       console.log("Call Accepted!");
//       sendStreams();
//     },
//     [sendStreams]
//   );

//   const handleNegoNeeded = useCallback(async () => {
//     const offer = await Peer.getOffer();
//     if (remoteSocketId && offer) {
//       socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
//     } else {
//       console.error("No remote socket ID or offer is invalid");
//     }
//   }, [remoteSocketId, socket]);

//   const handleNegoNeedIncoming = useCallback(
//     async ({ from, offer }) => {
//       if (!offer) {
//         console.error("Received invalid offer:", offer);
//         return;
//       }
//       const ans = await Peer.getAnswer(offer);
//       console.log("Sending answer:", ans);
//       socket.emit("peer:nego:done", { to: from, ans });
//     },
//     [socket]
//   );

//   useEffect(() => {
//     console.log("Peer object:", Peer);
//     Peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
//     return () => {
//       Peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
//     };
//   }, [handleNegoNeeded]);

//   useEffect(() => {
//     Peer.peer.addEventListener("track", async (ev) => {
//       const remoteStream = ev.streams;
//       console.log("GOT TRACKS!");
//       setRemoteStream(remoteStream[0]);
//     });
//   }, []);

//   useEffect(() => {
//     socket.on("user:joined", handleUserJoined);
//     socket.on("incoming:call", handleIncomingCall);
//     socket.on("call:accepted", handleCallAccepted);
//     socket.on("peer:nego:needed", handleNegoNeedIncoming);
//     socket.on("peer:nego:final", handleNegoNeedFinal);

//     return () => {
//       socket.off("user:joined", handleUserJoined);
//       socket.off("incoming:call", handleIncomingCall);
//       socket.off("call:accepted", handleCallAccepted);
//       socket.off("peer:nego:needed", handleNegoNeedIncoming);
//       socket.off("peer:nego:final", handleNegoNeedFinal);
//     };
//   }, [
//     socket,
//     handleUserJoined,
//     handleIncomingCall,
//     handleCallAccepted,
//     handleNegoNeedFinal,
//     handleNegoNeedIncoming,
//   ]);

//   const videoBoxSize = useBreakpointValue({ base: "90%", md: "45%" });

//   return (
//     <Box p={4}>
//       <Heading as="h1" size="lg" textAlign="center" mb={4}>
//         Video Chat Room
//       </Heading>
//       <Flex
//         direction={{ base: "column", md: "row" }}
//         justifyContent="center"
//         alignItems="center"
//         mb={4}
//       >
//         <Box
//           textAlign="center"
//           mb={{ base: 4, md: 0 }}
//           mr={{ md: 4 }}
//           width={videoBoxSize}
//         >
//           <Heading as="h3" size="md" mb={2}>
//             {email}'s Stream
//           </Heading>
//           <Box
//             border="1px solid #ccc"
//             borderRadius="md"
//             overflow="hidden"
//             width="100%"
//             height="50vh"
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             bg={!myStream ? "#c3b091" : "transparent"}
//           >
//             {myStream ? (
//               <ReactPlayer
//                 playing
//                 volume={1}
//                 height="100%"
//                 width="100%"
//                 url={myStream}
//               />
//             ) : (
//               <Text>Waiting for your stream...</Text>
//             )}
//           </Box>
//         </Box>
//         <Box textAlign="center" width={videoBoxSize}>
//           <Heading as="h3" size="md" mb={2}>
//             Remote Stream
//           </Heading>
//           <Box
//             border="1px solid #ccc"
//             borderRadius="md"
//             overflow="hidden"
//             width="100%"
//             height="50vh"
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             bg={!remoteStream ? "#c3b091" : "transparent"}
//           >
//             {remoteStream ? (
//               <ReactPlayer
//                 playing
//                 volume={1}
//                 height="100%"
//                 width="100%"
//                 url={remoteStream}
//               />
//             ) : (
//               <Text>Waiting for remote stream...</Text>
//             )}
//           </Box>
//         </Box>
//       </Flex>
//       <Flex justifyContent="center" alignItems="center">
//         <Button
//           onClick={sendStreams}
//           disabled={!myStream}
//           variant="solid"
//           colorScheme="blue"
//           mr={4}
//           bg="#c3b091"
//         >
//           Share Your Video
//         </Button>
//         <Button onClick={handleCallUser} variant="solid" colorScheme="green">
//           Ring
//           <Box ml={2}>
//             <PhoneIcon />
//           </Box>
//         </Button>
//       </Flex>
//     </Box>
//   );
// };

// export default Room;
