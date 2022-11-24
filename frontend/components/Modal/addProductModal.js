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
  FormControl,
  Input,
  Box,
  Text,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import TextInput from "../TextInputs/TextInput";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import { log } from "console";
import { toaster } from "evergreen-ui";
import UserContext from "../../context/User";

const AddProductModal = ({
  isOpen,
  onClose,
  header,
}) => {
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [productFile, setProductFile] = useState();
  const [uploadLink, setUploadLink] = useState('');
  const user = useContext(UserContext);

  // Upload a file to ipfs and return the cid
  const uploadDocument = async () => {
    setIsSubmiting(true);
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVBQzdkNzllM0JkYjZFRTA2YTEyOTM5NzFEM2VDMTdGM2VEMDY1NTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjA1NzI3ODUyMzIsIm5hbWUiOiJFbmxpZ2h0ZW4ifQ.5J8VraV5Jd0jia6I8AvDxSTB0oNiNbq-r470OXUMKMQ";
      const storage = new Web3Storage({ token })
      console.log(typeof productFile);
      const cid = await storage.put([productFile]);
      if (cid) {
        setIsSubmiting(false);
      }
      setUploadLink(cid);
      return cid;
    } catch (error) {
      console.log(error);
      toaster.danger("Error occured");
      setIsSubmiting(false);
    }
  }

  const handleProceed = async () => {
    const cid = await uploadDocument();
    await user.wallet.callMethod({ contractId: user.contractId, method: "create_product", args: { name: productName, description: productDesc, url: cid } });
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

              <FormControl mt="20px">
                <FormLabel color="brand.dark" fontSize="14px" fontWeight="500">
                  Upload Product Document
                </FormLabel>
                <Input type="file" name="upload" accept="application/pdf" onChange={(e) => { setProductFile(e.target.files[0]) }} />
                <Text color="brand.blue" mt="10px">{isSubmiting ? 'File uploading...' : uploadLink !== '' ? 'Hooray!! File uploaded, creating product...' : null}</Text>

              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              bgColor="brand.blue"
              color="brand.white"
              onClick={handleProceed}
              disabled={!productName || !productDesc || !productFile}
            >
              Add Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddProductModal;
