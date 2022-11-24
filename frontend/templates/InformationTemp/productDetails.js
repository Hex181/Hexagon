import { Box, Flex, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../../context/User";
import LatestNews from "../LatestNews";
import RelatedDrugs from "../LatestNews/relatedDrugs";

const ProductDetailsTemp = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [product, setProduct] = useState();

  const getProduct = async () => {
    try {
      const product = await user.wallet.viewMethod({ contractId: user.contractId, method: "get_product", args: { name: id } });
      setProduct(product)
      navigate(`/information/product-details/${id}`);
    } catch (err) {
      navigate("/information");
      console.log(err);
    }
  }

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <Flex w="100%">
      <Box w="70%">
        <Box bg="brand.white" p="40px" color="#3A3A3ABF">
          <Text color="brand.dark" fontWeight="600" fontSize="20px">
            Name: {product?.name}
          </Text>
          <Text mt="10px">
            {product?.description}
          </Text>
          <Text mt="30px">
            Read more: {product?.url}
          </Text>
        </Box>
      </Box>

      <Box w="30%" ml="20px">
        <LatestNews />
      </Box>
    </Flex>
  );
};

export default ProductDetailsTemp;
