import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";
import ReactPlayer from "react-player";
import Peer from "./Peer";

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

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

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await Peer.setLocalDescription(ans);
  }, []);

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      Peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      console.log("Received answer:", ans);
      Peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  // Emitting the negotiation needed event
  const handleNegoNeeded = useCallback(async () => {
    const offer = await Peer.getOffer();
    if (remoteSocketId && offer) {
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    } else {
      console.error("No remote socket ID or offer is invalid");
    }
  }, [remoteSocketId, socket]);

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      // Ensure offer is correctly destructured
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

  useEffect(() => {
    console.log("Peer object:", Peer);
    Peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      Peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    Peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

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

  return (
    <div>
      <h1>this is the room page</h1>
      <h2>{remoteSocketId ? "Connected" : "No one in the Room"}</h2>
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            volume={1}
            height="200px"
            width="200px"
            url={myStream}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            volume={1}
            height="200px"
            width="200px"
            url={remoteStream}
          />
        </>
      )}
    </div>
  );
};

export default Room;

// import React, { useCallback, useEffect, useState } from "react";
// import { useSocket } from "./SocketProvider";
// import ReactPlayer from "react-player";
// import Peer from "./Peer";

// const Room = () => {
//   const socket = useSocket();
//   const [remoteSocketId, setRemoteSocketId] = useState(null);
//   const [myStream, setMyStream] = useState();

//   const handleUserJoined = useCallback(({ email, id }) => {
//     console.log(`Email ${email} joined room`);
//     setRemoteSocketId(id);
//   }, []);

//   const handleCallUser = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     const offer = await Peer.getOffer();
//     socket.emit("user:call", { to: remoteSocketId, offer });
//     setMyStream(stream);
//   }, [remoteSocketId, socket]);

//   const handleIncomingCall = useCallback(
//     async (from, offer) => {
//       setRemoteSocketId(from);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setMyStream(stream);

//       console.log(`Incoming Call`, from, offer);
//       const ans = await Peer.getAnswer(offer);
//       socket.emit("call:accepeted", { to: from, ans });
//     },
//     [socket]
//   );

//   const handleCallAccepted = useCallback(({ from, ans }) => {
//     Peer.setLocalDescription(ans);
//     console.log("Call Accepted!");
//   }, []);

//   useEffect(() => {
//     socket.on("user:joined", handleUserJoined);
//     socket.on("incoming:call", handleIncomingCall);
//     socket.on("call:accepted", handleCallAccepted);

//     return () => {
//       socket.off("user:joined", handleUserJoined);
//       socket.off("incoming:call", handleIncomingCall);
//       socket.off("call:accepted", handleCallAccepted);
//     };
//   }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted]);

//   return (
//     <div>
//       <h1>this is the room page</h1>
//       <h2>{remoteSocketId ? "Connected" : "No one in the Room"}</h2>
//       {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
//       {myStream && (
//         <>
//           <h1>My Stream</h1>
//           <ReactPlayer
//             playing
//             muted
//             height="200px"
//             width="200px"
//             url={myStream}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default Room;
