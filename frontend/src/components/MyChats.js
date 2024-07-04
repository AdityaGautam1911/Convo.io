import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useTab } from "../Context/TabContext";
import Lobby from "../Video/Lobby";

const MyChats = ({ fetchAgain }) => {
  const { tabIndex, setTabIndex } = useTab();

  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      color="white"
      borderColor="#54235b"
      // bg="	#d9b99b"
      bg="linear-gradient(25deg, rgba(77,77,77,1) 0%, rgba(217,185,155,1) 100%)"
    >
      <Tabs
        isFitted
        variant="custom-variant" // Use the custom variant here
        colorScheme="customColorScheme"
        w="100%"
        onChange={(index) => {
          setTabIndex(index);
          console.log("Tab index changed to:", index);
        }}
        color="white"
      >
        <TabList>
          <Tab bg="#dbd2c3">My Chats</Tab>
          <Tab bg="#dbd2c3">Video Call</Tab>
        </TabList>
        <TabPanels>
          <TabPanel pb={0} px={0}>
            <Box
              pb={3}
              px={3}
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work Sans"
              d="flex"
              w="100%"
              justifyContent="space-between"
              alignItems="center"
              // bg="#D2B48C"
              bg="linear-gradient(25deg, rgba(77,77,77,1) 0%, rgba(217,185,155,1) 100%)"
              color="white"
              borderTopRadius="lg"
              padding="5px"
            >
              <Text
                fontSize="2xl"
                fontFamily="Work sans"
                color="white"
                pl={4}
                fontWeight="bold"
              >
                ALL CHATS
              </Text>
              <GroupChatModal>
                <Button
                  d="flex"
                  fontSize={{ base: "17px", md: "10px", lg: "12px" }}
                  rightIcon={<AddIcon />}
                  bg="linear-gradient(184deg, rgba(183,183,183,1) 0%, rgba(125,114,93,1) 100%)"
                  color="white"
                >
                  New Group Chat
                </Button>
              </GroupChatModal>
            </Box>
            <Box
              d="flex"
              flexDir="column"
              p={1}
              // bg="#D2B48C"
              bg="linear-gradient(83deg, rgba(77,77,77,1) 0%, rgba(217,185,155,1) 100%)"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
              borderTopRadius="none"
            >
              {chats ? (
                <Stack overflowY="scroll" maxH="calc(100vh - 230px)">
                  {chats.map((chat) => (
                    <Box
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      cursor="pointer"
                      bg={
                        selectedChat === chat
                          ? "linear-gradient(184deg, rgba(237,237,232,1) 0%, rgba(255,255,255,1) 100%)"
                          : "linear-gradient(6deg, rgba(183,183,183,1) 0%, rgba(250,240,230,1) 100%)"
                      }
                      color={selectedChat === chat ? "black" : "black"}
                      px={3}
                      py={2}
                      borderRadius="lg"
                      // mb={2}
                    >
                      <Text>
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                      {chat.latestMessage && (
                        <Text fontSize="xs">
                          <b>{chat.latestMessage.sender.name} : </b>
                          {chat.latestMessage.content.length > 50
                            ? `${chat.latestMessage.content.substring(
                                0,
                                51
                              )}...`
                            : chat.latestMessage.content}
                        </Text>
                      )}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <ChatLoading />
              )}
            </Box>
          </TabPanel>
          <TabPanel pb={0} px={0}>
            <Lobby />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MyChats;

// import { AddIcon } from "@chakra-ui/icons";
// import { Box, Stack, Text } from "@chakra-ui/layout";
// import { useToast } from "@chakra-ui/toast";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getSender } from "../config/ChatLogics";
// import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
// import { Button } from "@chakra-ui/react";
// import { ChatState } from "../Context/ChatProvider";
// import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
// import { useTab } from "../Context/TabContext";
// import Lobby from "../Video/Lobby";

// const MyChats = ({ fetchAgain }) => {
//   const { tabIndex, setTabIndex } = useTab();

//   const [loggedUser, setLoggedUser] = useState();

//   const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

//   const toast = useToast();

//   const fetchChats = async () => {
//     // console.log(user._id);
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const { data } = await axios.get("/api/chat", config);
//       setChats(data);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: "Failed to Load the chats",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom-left",
//       });
//     }
//   };

//   useEffect(() => {
//     setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
//     fetchChats();
//     // eslint-disable-next-line
//   }, [fetchAgain]);

//   return (
//     <Box
//       d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
//       flexDir="column"
//       alignItems="center"
//       p={3}
//       w={{ base: "100%", md: "31%" }}
//       borderRadius="lg"
//       borderWidth="1px"
//       color="white"
//       borderColor="#54235b"
//       bg="	#d9b99b"
//     >
//       <Tabs
//         isFitted
//         variant="custom-variant" // Use the custom variant here
//         colorScheme="customColorScheme"
//         w="100%"
//         onChange={(index) => {
//           setTabIndex(index);
//           console.log("Tab index changed to:", index);
//         }}
//         color="white"
//       >
//         <TabList>
//           <Tab>My Chats</Tab>
//           <Tab>Video Call</Tab>
//         </TabList>
//         <TabPanels>
//           <TabPanel pb={0} px={0}>
//             <Box
//               pb={3}
//               px={3}
//               fontSize={{ base: "28px", md: "30px" }}
//               fontFamily="Work Sans"
//               d="flex"
//               w="100%"
//               justifyContent="space-between"
//               alignItems="center"
//               bg="#d9b99b"
//               color="white"
//               borderTopRadius="lg"
//               padding="5px"
//             >
//               <Text fontSize="2xl" fontFamily="Work sans" color="white">
//                 ALL CHATS
//               </Text>
//               <GroupChatModal>
//                 <Button
//                   d="flex"
//                   fontSize={{ base: "17px", md: "10px", lg: "17px" }}
//                   rightIcon={<AddIcon />}
//                   bg="black"
//                   color="white"
//                 >
//                   New Group Chat
//                 </Button>
//               </GroupChatModal>
//             </Box>
//             <Box
//               d="flex"
//               flexDir="column"
//               p={1}
//               bg="#d9b99b"
//               w="100%"
//               h="100%"
//               borderRadius="lg"
//               overflowY="hidden"
//               borderTopRadius="none"
//             >
//               {chats ? (
//                 <Stack overflowY="scroll">
//                   {chats.map((chat) => (
//                     <Box
//                       onClick={() => setSelectedChat(chat)}
//                       cursor="pointer"
//                       bg={selectedChat === chat ? "white" : "white"}
//                       color={selectedChat === chat ? "black" : "black"}
//                       px={3}
//                       py={2}
//                       borderRadius="lg"
//                       key={chat._id}
//                     >
//                       <Text>
//                         {!chat.isGroupChat
//                           ? getSender(loggedUser, chat.users)
//                           : chat.chatName}
//                       </Text>
//                       {chat.latestMessage && (
//                         <Text fontSize="xs">
//                           <b>{chat.latestMessage.sender.name} : </b>
//                           {chat.latestMessage.content.length > 50
//                             ? chat.latestMessage.content.substring(0, 51) +
//                               "..."
//                             : chat.latestMessage.content}
//                         </Text>
//                       )}
//                     </Box>
//                   ))}
//                 </Stack>
//               ) : (
//                 <ChatLoading />
//               )}
//             </Box>
//           </TabPanel>
//           <TabPanel pb={0} px={0}>
//             <Lobby />
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </Box>
//   );
// };

// export default MyChats;
