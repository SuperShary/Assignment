import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";

// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { postApi, checkServerStatus } from "services/api";
import { loginSchema } from "schema";
import { toast } from "react-toastify";
import Spinner from "components/spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../../../redux/slices/imageSlice";
import { setUser } from "../../../redux/slices/localSlice";
import { constant } from "../../../constant";

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [isLoding, setIsLoding] = React.useState(false);
  const [checkBox, setCheckBox] = React.useState(true);
  const [loginError, setLoginError] = React.useState("");
  const [serverStatus, setServerStatus] = React.useState({
    checking: true,
    online: false,
    message: "Checking server connection..."
  });

  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch the fetchRoles action on component mount
    dispatch(fetchImage("?isActive=true"));
    
    // Check if server is running
    const checkServer = async () => {
      try {
        setServerStatus({ checking: true, online: false, message: "Checking server connection..." });
        const status = await checkServerStatus();
        
        if (status.online) {
          setServerStatus({ 
            checking: false, 
            online: true, 
            message: "Server is online. MongoDB: " + (status.data?.mongoConnected ? "Connected" : "Disconnected") 
          });
        } else {
          setServerStatus({ 
            checking: false, 
            online: false, 
            message: "Server is offline. Please start the server and try again." 
          });
        }
      } catch (err) {
        setServerStatus({ 
          checking: false, 
          online: false, 
          message: "Could not connect to server. Please ensure the server is running." 
        });
      }
    };
    
    checkServer();
  }, [dispatch]);

  const image = useSelector((state) => state?.images?.images);

  const [show, setShow] = React.useState(false);
  const showPass = () => setShow(!show);

  const initialValues = {
    username: "",
    password: "",
  };
  const {
    errors,
    values,
    touched,
    handleBlur,
    handleChange,
    resetForm,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { resetForm }) => {
      login();
    },
  });
  const navigate = useNavigate();

  // Direct login with hardcoded admin credentials
  const adminLogin = async () => {
    try {
      if (!serverStatus.online) {
        setLoginError("Server is not running. Please start the server and try again.");
        return;
      }
      
      setIsLoding(true);
      setLoginError("");
      
      const adminCredentials = {
        username: "admin@gmail.com",
        password: "admin123"
      };
      
      console.log("Using admin credentials");
      let response = await postApi("api/user/login", adminCredentials, checkBox);
      
      if (response && response.status === 200) {
        navigate("/superAdmin");
        toast.success("Login Successfully!");
        dispatch(setUser(response?.data?.user));
      } else {
        const errorMessage = "Admin login failed. Server might be down.";
        setLoginError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (e) {
      console.error("Admin login error:", e);
      let errorMessage;
      
      if (e.message === "Network Error") {
        errorMessage = "Server connection error. Please make sure the server is running.";
      } else {
        errorMessage = e.response?.data?.error || e.message || "An error occurred during login.";
      }
      
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoding(false);
    }
  };

  const login = async () => {
    try {
      if (!serverStatus.online) {
        setLoginError("Server is not running. Please start the server and try again.");
        return;
      }
      
      setIsLoding(true);
      setLoginError("");
      console.log("Login attempt with:", values);
      console.log("API URL:", constant.baseUrl + "api/user/login");
      
      let response = await postApi("api/user/login", values, checkBox);
      console.log("Login response:", response);
      
      if (response && response.status === 200) {
        console.log("Login successful, token:", response.data?.token);
        navigate("/superAdmin");
        toast.success("Login Successfully!");
        resetForm();
        dispatch(setUser(response?.data?.user));
      } else {
        console.error("Login failed:", response);
        const errorMessage = response.response?.data?.error || "Invalid email or password. Please try again.";
        setLoginError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (e) {
      console.error("Login error:", e);
      let errorMessage;
      
      if (e.message === "Network Error") {
        errorMessage = "Server connection error. Please make sure the server is running.";
      } else {
        errorMessage = e.response?.data?.error || e.message || "An error occurred during login.";
      }
      
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <DefaultAuth
      illustrationBackground={image?.length > 0 && image[0]?.authImg}
      image={image?.length > 0 && image[0]?.authImg}
    >
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="fit-content"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          {!serverStatus.online && !serverStatus.checking && (
            <Alert status="error" mb="15px" borderRadius="md">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Server Connection Error</AlertTitle>
                <AlertDescription display="block">
                  {serverStatus.message}
                </AlertDescription>
              </Box>
              <CloseButton position="absolute" right="8px" top="8px" />
            </Alert>
          )}
          
          {serverStatus.checking && (
            <Alert status="info" mb="15px" borderRadius="md">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Checking Server Status</AlertTitle>
                <AlertDescription display="block">
                  Please wait while we check the server connection...
                </AlertDescription>
              </Box>
            </Alert>
          )}
          
          {loginError && (
            <Box mb="15px" p="10px" bg="red.50" borderRadius="md" color="red.500">
              {loginError}
            </Box>
          )}
          <form onSubmit={handleSubmit}>
            <FormControl isInvalid={errors.username && touched.username}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                name="username"
                ms={{ base: "0px", md: "0px" }}
                type="email"
                placeholder="mail@simmmple.com"
                mb={errors.username && touched.username ? undefined : "24px"}
                fontWeight="500"
                size="lg"
                borderColor={
                  errors.username && touched.username ? "red.300" : null
                }
                className={
                  errors.username && touched.username ? "isInvalid" : null
                }
              />
              {errors.username && touched.username && (
                <FormErrorMessage mb="24px">
                  {" "}
                  {errors.username}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              isInvalid={errors.password && touched.password}
              mb="24px"
            >
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Enter Your Password"
                  name="password"
                  mb={errors.password && touched.password ? undefined : "24px"}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="lg"
                  variant="auth"
                  type={show ? "text" : "password"}
                  borderColor={
                    errors.password && touched.password ? "red.300" : null
                  }
                  className={
                    errors.password && touched.password ? "isInvalid" : null
                  }
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={showPass}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && touched.password && (
                <FormErrorMessage mb="24px">
                  {" "}
                  {errors.password}
                </FormErrorMessage>
              )}
              <Flex justifyContent="space-between" align="center" mb="24px">
                <FormControl display="flex" alignItems="center">
                  <Checkbox
                    onChange={(e) => setCheckBox(e.target.checked)}
                    id="remember-login"
                    value={checkBox}
                    defaultChecked
                    colorScheme="brandScheme"
                    me="10px"
                  />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    fontWeight="normal"
                    color={textColor}
                    fontSize="sm"
                  >
                    Keep me logged in
                  </FormLabel>
                </FormControl>
              </Flex>

              <Flex
                justifyContent="space-between"
                align="center"
                mb="24px"
              ></Flex>
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                type="submit"
                mb="24px"
                disabled={isLoding || !serverStatus.online}
              >
                {isLoding ? <Spinner /> : "Sign In"}
              </Button>
              
              <Button
                fontSize="sm"
                variant="outline"
                colorScheme="teal"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                onClick={adminLogin}
                disabled={isLoding || !serverStatus.online}
              >
                {isLoding ? <Spinner /> : "Use Admin Login"}
              </Button>
              
              {!serverStatus.online && !serverStatus.checking && (
                <Button
                  fontSize="sm"
                  variant="outline"
                  colorScheme="blue"
                  fontWeight="500"
                  w="100%"
                  h="50"
                  mb="24px"
                  onClick={() => window.location.reload()}
                >
                  Retry Connection
                </Button>
              )}
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
