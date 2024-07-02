import { Box } from "@chakra-ui/layout";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import { useTab } from "../Context/TabContext";
import Room from "../Video/Room";
import Welcome from "../Video/Welcome";
const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const { tabIndex } = useTab();
  const { roomId } = useParams();

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {tabIndex === 0 && (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      )}
      {
        tabIndex === 1 && (roomId ? <Room roomId={roomId} /> : <Welcome />) // Conditionally render Room or Lobby
      }
    </Box>
  );
};

export default Chatbox;
