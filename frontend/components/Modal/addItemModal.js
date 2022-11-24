import { TriangleDownIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import UserContext from "../../context/User";
import CustomButton from "../CustomButton/customButton";
import TextInput from "../TextInputs/TextInput";

useContext
const AddItemModal = ({ isOpen, onClose, header }) => {
  const {
    isOpen: isOpenCode,
    onOpen: onOpenCode,
    onClose: onCloseCode,
  } = useDisclosure();

  const [itemNumber, setItemNumber] = useState("");
  const [productName, setProductName] = useState("");

  const handleProceed = (e) => {
    e.preventDefault();
    console.log({ itemNumber, productName });
    onClose();
    onOpenCode();
  };

  const codes = [
    {
      name: "Paracetamol",
      val: "123456"
    },
    {
      name: "Ampiclox",
      val: "1234533322"
    },
    {
      name: "Flagyl",
      val: "09233"
    },
  ];

  const productLists = ["Paracetamol", "Amoxylin"];
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl mt="20px">
                <FormLabel color="brand.dark" fontSize="14px" fontWeight="500">
                  Select Product
                </FormLabel>
                <Select
                  placeholder="Which product do you want to add ?"
                  focusBorderColor="#65D593"
                  _focus={{ border: "0.1px solid #65D593" }}
                  _placeholder={{
                    color: "#718096",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                  icon={<TriangleDownIcon />}
                  size="lg"
                  fontSize="16px"
                  height="48px"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                >
                  {productLists.map((productList) => (
                    <option value={productList} key={productList}>
                      {productList}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <TextInput
                label="How many items do you want to add"
                placeholder="Enter number of items to add"
                type="number"
                onChange={(e) => setItemNumber(e.target.value)}
                value={itemNumber}
              />
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose} borderRadius="4rem">
              Cancel
            </Button>
            <CustomButton
              onClick={handleProceed}
              bg="brand.blue"
              color="brand.white"
              disabled={!itemNumber || !productName || itemNumber === "0"}
            >
              Add Item
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenCode} onClose={onCloseCode}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Display Manufacturer's Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {codes.map((code) => (
              <TextInput
                label={`${code.name} Code`}
                type="number"
                value={code.val}
                isReadOnly
                key={code.val}
              />
            ))}
            <Text fontSize="12px" mt="10px" color="brand.blue">
              Note: Ensure to print this page and store safely.{" "}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} borderRadius="4rem" onClick={onCloseCode}>
              Close
            </Button>
            <CustomButton bg="brand.blue" color="brand.white" onClick={() => window.print()}>
              Print Page
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddItemModal;
