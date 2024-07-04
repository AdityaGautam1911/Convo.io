import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="linear-gradient(42deg, rgba(0,0,0,1) 0%, rgba(190,190,190,1) 100%)"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        color="white"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Convo.io
        </Text>
      </Box>
      <Box
        bg="linear-gradient(61deg, rgba(0,0,0,1) 0%, rgba(190,190,190,1) 100%)"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        color="white"
      >
        <Tabs
          isFitted
          variant="custom-variant" // Use the custom variant here
          colorScheme="customColorScheme"
        >
          <TabList mb="1em">
            <Tab bg="linear-gradient(184deg, rgba(183,183,183,1) 0%, rgba(125,114,93,1) 100%)">
              Login
            </Tab>
            <Tab bg="linear-gradient(184deg, rgba(183,183,183,1) 0%, rgba(125,114,93,1) 100%)">
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
