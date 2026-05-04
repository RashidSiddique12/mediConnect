import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout({ role }) {
  return (
    <Flex h="100vh" bg="chakra-body-bg" overflow="hidden">
      <Sidebar role={role} />
      <Flex direction="column" flex={1} minW={0} h="100vh">
        <Header />
        <Box as="main" flex={1} overflowY="auto" p={6}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
