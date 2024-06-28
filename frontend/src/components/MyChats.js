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

const MyChats = ({ fetchAgain }) => {
  const { tabIndex, setTabIndex } = useTab();

  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
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
        title: "Error Occured!",
        description: "Failed to Load the chats",
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
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Tabs
        isFitted
        variant="soft-rounded"
        colorScheme="green"
        w="100%"
        onChange={(index) => {
          setTabIndex(index);
          console.log("Tab index changed to:", index);
        }}
      >
        <TabList>
          <Tab>My Chats</Tab>
          <Tab>Video Call</Tab>
        </TabList>
        <TabPanels>
          <TabPanel pb={0} px={0}>
            <Box
              pb={3}
              px={3}
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
              d="flex"
              w="100%"
              justifyContent="space-between"
              alignItems="center"
              bg="white"
            >
              My Chats
              <GroupChatModal>
                <Button
                  d="flex"
                  fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                  rightIcon={<AddIcon />}
                >
                  New Group Chat
                </Button>
              </GroupChatModal>
            </Box>
            <Box
              d="flex"
              flexDir="column"
              p={3}
              bg="#F8F8F8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {chats ? (
                <Stack overflowY="scroll">
                  {chats.map((chat) => (
                    <Box
                      onClick={() => setSelectedChat(chat)}
                      cursor="pointer"
                      bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                      color={selectedChat === chat ? "white" : "black"}
                      px={3}
                      py={2}
                      borderRadius="lg"
                      key={chat._id}
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
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
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
            <Box
              pb={3}
              px={3}
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
              d="flex"
              w="100%"
              justifyContent="space-between"
              alignItems="center"
              bg="pink"
            >
              This is the Video calling section !!
            </Box>
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

// const MyChats = ({ fetchAgain }) => {
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
//       bg="white"
//       w={{ base: "100%", md: "31%" }}
//       borderRadius="lg"
//       borderWidth="1px"
//     >
//       <Tabs isFitted variant="soft-rounded" colorScheme="green" w="100%">
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
//               fontFamily="Work sans"
//               d="flex"
//               w="100%"
//               justifyContent="space-between"
//               alignItems="center"
//               bg="white"
//             >
//               My Chats
//               <GroupChatModal>
//                 <Button
//                   d="flex"
//                   fontSize={{ base: "17px", md: "10px", lg: "17px" }}
//                   rightIcon={<AddIcon />}
//                 >
//                   New Group Chat
//                 </Button>
//               </GroupChatModal>
//             </Box>
//             <Box
//               d="flex"
//               flexDir="column"
//               p={3}
//               bg="#F8F8F8"
//               w="100%"
//               h="100%"
//               borderRadius="lg"
//               overflowY="hidden"
//             >
//               {chats ? (
//                 <Stack overflowY="scroll">
//                   {chats.map((chat) => (
//                     <Box
//                       onClick={() => setSelectedChat(chat)}
//                       cursor="pointer"
//                       bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
//                       color={selectedChat === chat ? "white" : "black"}
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
//             <Box
//               pb={3}
//               px={3}
//               fontSize={{ base: "28px", md: "30px" }}
//               fontFamily="Work sans"
//               d="flex"
//               w="100%"
//               justifyContent="space-between"
//               alignItems="center"
//               bg="pink"
//             >
//               This is the Video calling section !!
//             </Box>
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </Box>
//   );
// };

// export default MyChats;
