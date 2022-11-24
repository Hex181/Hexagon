import {
  Box,
  Flex,
  Image,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import DashboardIcon from "../../assets/icons/dashboard-icon.png";
import CustomButton from "../../components/CustomButton/customButton";
import AddItemModal from "../../components/Modal/addItemModal";
import AddProductModal from "../../components/Modal/addProductModal";
import UserContext from "../../context/User";
import LatestNews from "../LatestNews";

const ManufacturerDashboardTemp = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: itemIsOpen, onOpen: itemOnOpen, onClose: itemOnClose } = useDisclosure();
  const [manufacturer, setManufacturer] = useState();
  const user = useContext(UserContext);

  const getManufacturer = async () => {
    const res = await user.wallet.viewMethod({ contractId: user.contractId, method: "get_manufacturer", args: { account_id: user.wallet.accountId } });
    return res;
  }

  useEffect(() => {
    console.log(user);
    getManufacturer().then((res) => { console.log(res); setManufacturer(res) });
  }, []);

  return (
    <Flex w="100%">
      <Box w="70%">
        <SimpleGrid
          columns={2}
          bg="brand.blue"
          alignItems="center"
          p="40px 20px"
          borderRadius="8px"
        >
          <Box>
            <Text color="brand.white" fontSize="28px">
              Welcome {manufacturer?.name}
            </Text>
            <Text color="brand.lightGrey">
              This is your dashboard where you can create new products and items
            </Text>
          </Box>
          <Box ml="40px">
            <Image src={DashboardIcon} alt="dahsboard-home-icon" />
          </Box>
        </SimpleGrid>

        <Box bg="brand.white" p="40px" mt="40px" borderRadius="8px">
          <Flex mb="20px" alignItems="center" justifyContent="space-between">
            <Text cursor="pointer" _hover={{ color: "brand.blue" }}>
              Your products
            </Text>
            <CustomButton
              bg="brand.blue"
              color="brand.white"
              hoverBg="brand.primary"
              hoverColor="brand.white"
              onClick={onOpen}
            >
              Create new product
            </CustomButton>
          </Flex>
          <SimpleGrid columns={3} gap="30px">
            {manufacturer?.products.map((item, index) => (
              <Flex
                alignItems="center"
                bg="#F3F6FB"
                p="20px"
                borderRadius="8px"
                key={index}
              >
                <Box>{item.icon}</Box>
                <Text color="brand.dark" ml="10px">
                  {item}
                </Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>

        <Box mt="50px" bg="brand.white" p="40px">
          <Flex mb="20px" alignItems="center" justifyContent="space-between">
            <Text color="brand.dark" fontSize="16px" mb="10px">
              Create new items
            </Text>

            <CustomButton
              bg="brand.blue"
              color="brand.white"
              hoverBg="brand.primary"
              hoverColor="brand.white"
              onClick={itemOnOpen}
            >
              Create Items
            </CustomButton>
          </Flex>
        </Box>
      </Box>

      <Box w="30%" ml="20px">
        <LatestNews />
      </Box>

      <AddProductModal
        isOpen={isOpen}
        onClose={onClose}
        header="Add Products "
      // handleProceed={handleProceed}
      />

      <AddItemModal
        isOpen={itemIsOpen}
        onClose={itemOnClose}
        header="Fill in Item Number"
      />
    </Flex>
  );
};

export default ManufacturerDashboardTemp;
