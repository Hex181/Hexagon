import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import TextInput from "../TextInputs/TextInput";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';

const AddProdcutModal = ({ isOpen, onClose, header, handleProceed, children }) => {
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productDocument, setProductDocument] = useState();

  // Upload a file to ipfs and return the cid
  const uploadDocument = () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVBQzdkNzllM0JkYjZFRTA2YTEyOTM5NzFEM2VDMTdGM2VEMDY1NTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjA1NzI3ODUyMzIsIm5hbWUiOiJFbmxpZ2h0ZW4ifQ.5J8VraV5Jd0jia6I8AvDxSTB0oNiNbq-r470OXUMKMQ";
    const storage = new Web3Storage({ token })
    const cid = storage.put(productDocument);
    return cid;
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
              <TextInput
                label="Product Name"
                placeholder="Enter product name"
                onChange={(e) => setProductName(e.target.value)}
                value={productName}
              />
              <FormLabel
                color="brand.dark"
                fontSize="14px"
                fontWeight="300"
                mt="20px"
              >
                Product Description
              </FormLabel>
              <Textarea
                placeholder="Enter product description"
                focusBorderColor="#0368FF"
                _focus={{ border: "0.1px solid #0368FF" }}
                fontSize="14px"
                onChange={(e) => setProductDesc(e.target.value)}
                value={productDesc}
              />
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              bgColor="brand.teal"
              color="brand.white"
              onClick={handleProceed}
            >
              Add Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddProdcutModal;
