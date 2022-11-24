import { Box, Flex, Text } from "@chakra-ui/react";
import SideBar from "../components/NavBar/SideBar";
import SearchInput from "../components/TextInputs/SearchInput";
import { useContext } from "react";
import UserContext from "../context/User";
import CustomButton from "../components/CustomButton/customButton";

const DashboardContainer = ({ children }) => {
  const user = useContext(UserContext);

  return (
    <Flex bg="#F3F6FB">
      <Box className="side-bar" w="25%" bg="white" p="40px">
        <SideBar />
      </Box>
      <Box className="content" w="75%" mb="30px">
        <Flex justifyContent="space-between" alignItems="center" w="100%" p="20px 40px" bg="white" border="1px solid rgba(196, 196, 196, 0.4)">
          <SearchInput placeholder="Search" w="400px" />
          <Flex alignItems="center">
            {
              user?.isSignedIn ?
                <CustomButton color="red" mr="50px" cursor="pointer" onClick={() => user.wallet.signOut()} hoverBg="red" hoverColor="brand.white">Disconnect {user.wallet.accountId}</CustomButton> :
                <CustomButton color="brand.white" bg="brand.blue" mr="50px" cursor="pointer" onClick={() => user.wallet.signIn()}>Connect Wallet</CustomButton>
            }
            <Text mr="10px">Mode</Text>
            <Box>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </Box>
          </Flex>
        </Flex>
        {children}
      </Box >
    </Flex >
  );
};

export default DashboardContainer;
