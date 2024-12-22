import React from 'react'
import {  Box ,Text} from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/avatar'
const UserListItem = ({user,handleFunction}) => {
  return (
    <Box
     onClick={handleFunction}
     cursor="pointer"
     bg="#E8E8E8"
     _hover={{
        background:"#3882AC",
        color:"white"
     }}
     w="100%"
     display="flex"
     alignItems="center"
     color="black"
     px={3}
     py={2}
     mb={2}
     borderRadius="lg"
    >

        <Avatar
           mr={2}
           size='sm'
           cursor="pointer"
           name={user.name}
           pic={user.pic}

        />

        <Box>
            <Text>{user.name}</Text>
            <Text fontSize="x5">
                <b>Email : </b>
                {user.email}
            </Text>
        </Box>


    </Box>
  )
}

export default UserListItem