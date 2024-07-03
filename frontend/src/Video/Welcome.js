import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const Welcome = () => {
  return (
    <Box textAlign="center" position="relative">
      <Heading as="h1" size="xl" mt={8}>
        Get Started !!
      </Heading>
      <Text fontSize="xl" mt={4}>
        Enter the details and join the room!
      </Text>
    </Box>
  );
};

export default Welcome;
