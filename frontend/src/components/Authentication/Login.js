import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()
    const [show,setShow]=useState(false)
    const [loading,setLoading]=useState(false)
    const toast=useToast()
    const navigate = useNavigate();

    const handleClick=()=>setShow(!show)
    const submitHandler = async () => {
      setLoading(true);
      if (!email || !password) {
          toast({
              title: "Please Fill all the Fields",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom"
          });
          setLoading(false);
          return;
      }
  
      try {
          const config = {
              headers: {
                  "Content-Type": "application/json",              }
          };
  
          const { data } = await axios.post('/api/user/login', { email, password }, config);
          localStorage.setItem('authToken', data.token);

          toast({
              title: "Login Successful",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom"
          });
          localStorage.setItem('userInfo', JSON.stringify(data));
          setLoading(false);
          navigate('/chats');
  
      } catch (error) {
          toast({
              title: "Error Occurred!",
              description: error.response ? error.response.data.message : 'An unexpected error occurred',
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom"
          });
          setLoading(false);
      }
  };
      
    return (
        <VStack spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                 placeholder='Enter Your Email'
                 value={email}
                 onChange={(e)=>{setEmail(e.target.value)}}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                <Input 
                type={show?"text":"password"}
                 placeholder='Enter Your Password'
                 value={password}
                 onChange={(e)=>{setPassword(e.target.value)}}
                />
                <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                                {show ? "Hide":"Show"}
                            </Button>            
                </InputRightElement>
                </InputGroup>
            </FormControl>
    
            
            <Button
             colorScheme='blue'
             width="100%"
             style={{marginTop:15}}
             onClick={submitHandler}
             isLoading={loading}
            >Login</Button>

            <Button
              variant="solid"
              colorScheme='red'
              width="100%"
              onClick={()=>{
                setEmail("guest@gmail.com");
                setPassword("123456");
              }}
            >
                Get User Credentials
            </Button>
        </VStack>
      )
    }
    

export default Login