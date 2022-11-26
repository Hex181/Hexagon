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
import keccak256 from "keccak256";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/User";
import CustomButton from "../CustomButton/customButton";
import TextInput from "../TextInputs/TextInput";
import ShortUniqueId from 'short-unique-id';


const AddItemModal = ({ isOpen, onClose, header, products }) => {
  const {
    isOpen: isOpenCode,
    onOpen: onOpenCode,
    onClose: onCloseCode,
  } = useDisclosure();

  const [itemNumber, setItemNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [codes, setCodes] = useState([]);
  const user = useContext(UserContext);

  const handleProceed = (e) => {
    e.preventDefault();
    console.log({ itemNumber, productName });
    const uid = new ShortUniqueId({ length: 10 });
    let codes = [];
    for (let i = 0; i < itemNumber; i++) {
      codes.push(uid())
    }
    // const codes = user.wallet.callMethod({ contractId: user.contractId, method: "create_items", args: { amount: itemNumber, product: productName } });
    // const codes = ['hello', 'world', 'foo', 'bar', 'hello', 'world', 'foo', 'bar', 'hello', 'world', 'foo', 'bar', 'hello', 'world', 'foo', 'bar', 'hello', 'world', 'foo', 'bar', 'hello', 'world', 'foo', 'bar', 'hello', 'world', 'foo', 'bar', 'hello', 'world', 'foo', 'bar']
    setCodes(codes);
    onClose();
    onOpenCode();
  };

  const createItems = () => {
    user.wallet.callMethod({ contractId: user.contractId, method: "create_items", args: { codes, product: productName } });
  }

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
                  {products?.map((productList) => (
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
              Add Items
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenCode} onClose={onCloseCode}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Newly generated codes:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {codes.map((code) => (
              // <TextInput
              //   type="text"
              //   value={code}
              //   isReadOnly
              //   key={code}
              // />
              <Text display='inline' m="16px" p="16px" mt="12px" whiteSpace="nowrap">{code}</Text>
            ))}
            <Text fontSize="12px" mt="10px" color="red">
              Note: Print page first, then click on Create Items(Only then would these codes be valid).{" "}
            </Text>
          </ModalBody>
          <ModalFooter>
            <CustomButton bg="brand.blue" color="brand.white" onClick={() => window.print()}>
              Print Page
            </CustomButton>
            <CustomButton m="16px" bg="brand.blue" color="brand.white" onClick={() => createItems()}>
              Create Items
            </CustomButton>
            <Button mr={3} borderRadius="4rem" onClick={onCloseCode}>
              Close
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
};

export default AddItemModal;
