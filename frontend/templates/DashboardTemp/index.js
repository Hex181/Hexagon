import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { TextInput } from "evergreen-ui";
import { useContext, useState } from "react";
import DashboardIcon from "../../assets/icons/dashboard-icon.png";
import CustomButton from "../../components/CustomButton/customButton";
import UserContext from "../../context/User";
import { currentServices } from "../../utils/data";
import LatestNews from "../LatestNews";

const DashboardTemp = () => {
    const user = useContext(UserContext);

    const [productName, setProductName] = useState();

    const getProduct = async () => {

    }
    return (
        <Flex w="100%">
            <Box w="70%">
                <SimpleGrid columns={2} bg="brand.blue" alignItems="center" p="40px 20px" borderRadius="8px">
                    <Box>
                        <Text color="brand.white" fontSize="28px">Welcome to BONAFIDE</Text>
                        <Text color="brand.lightGrey">A drug verification and authentication system. A system where you get a reliable information about a product.</Text>

                        {!user.isSignedIn && <CustomButton bg="brand.white" borderRadius="8px" mt="40px">
                            <Text color="brand.blue" cursor="pointer" onClick={() => user.wallet.signIn()}>Connect Wallet</Text>
                        </CustomButton>}
                    </Box>
                    <Box ml="40px">
                        <Image src={DashboardIcon} alt="dahsboard-home-icon" />
                    </Box>
                </SimpleGrid>

                <SimpleGrid columns={3} gap="30px" bg="brand.white" p="40px" mt="40px" borderRadius="8px">
                    {currentServices.map((item, index) => (
                        <Flex alignItems="center" bg="#F3F6FB" p="20px" borderRadius="8px" key={index}>
                            <Box>{item.icon}</Box>
                            <Text color="brand.dark" ml="10px">{item.name}</Text>
                        </Flex>
                    ))}
                </SimpleGrid>

            </Box>

            <Box w="30%" ml="20px">
                <LatestNews />
            </Box>
        </Flex>
    )
};

export default DashboardTemp;