import React, { useEffect, useState, useRef } from 'react';
import { ChatState } from '../Context/CheckProvider';
import { Box, Flex, FormControl, IconButton, Input, Spinner, Text } from '@chakra-ui/react';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/chatLogics';
import ProfileModel from './misscellaneous/ProfileModel';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import UpdateGroupChatModal from './misscellaneous/UpdateGroupChatModal';
import './style.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";
import FileModel from './misscellaneous/FileModel';

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setfetchAgain }) => {
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [modes,setMode]=useState(true);
    const [isAtBottom, setIsAtBottom] = useState(true); // Track if the user is at the bottom of the chat

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const toast = useToast();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (isAtBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleScroll = () => {
        const element = messagesEndRef.current?.parentElement;
        if (element) {
            const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
            setIsAtBottom(atBottom);
        }
    };

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessage(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occurred",
                description: "Failed to load the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, []);

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                }
                setfetchAgain(!fetchAgain);
            } else {
                setMessage([...message, newMessageRecieved]);
            }
        });
    });

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        const container = messagesEndRef.current?.parentElement;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [message]);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                };
                setNewMessage("");
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id,
                    mode:modes,
                }, config);
                socket.emit('new message', data);
                setMessage([...message, data]);
            } catch (error) {
                toast({
                    title: "Error Occurred",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

   

    return (
        selectedChat ? (
            <>
                <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                    />
                    {!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                        </>
                    ) : (
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal
                                fetchAgain={fetchAgain}
                                setfetchAgain={setfetchAgain}
                                fetchMessages={fetchMessages}
                            />
                        </>
                    )}
                    <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => setMessage([])} // Attach delete function
                        aria-label="Delete Chat"
                    />
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#E8E8E8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                >
                    {loading ? <Spinner size='xl' w={20} h={20} alignSelf='center' margin='auto' /> : (
                        <div className='messages'>
                            <ScrollableChat messages={message} mode={false} />

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping ? <div>
                            <Lottie
                                options={{
                                    loop: true,
                                    autoplay: true,
                                    animationData: animationData,
                                    renderSettings: {
                                        preserveAspectRatio: "xMidYMid slice"
                                    }
                                }}
                                width={70}
                                style={{ marginBottom: 15, marginLeft: 0 }}
                            />
                        </div> : <></>}
                        <Flex align="center" bg="#E0E0E0" borderRadius="md" p={1}>
                            <Input
                                variant="unstyled"
                                placeholder="Enter a message"
                                onChange={(e) => setNewMessage(e.target.value)}
                                value={newMessage}
                                flex="1"
                                ml={2}
                            />
                            <FileModel user={getSenderFull(user, selectedChat.users)} onFileSelect={(fileUrl) => {
                               // console.log("Cloudinary File URL:", fileUrl);
                                setNewMessage(fileUrl); // Example: Setting the file URL in the parent state
                            }}
                                onModeSelect={(modeS) => { console.log("success", modeS); setMode(!modeS)}}/>
                        </Flex>
                    </FormControl>
                </Box>
            </>
        ) : (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="100%"
            >
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on a user to start chatting
                </Text>
            </Box>
        )
    );
};

export default SingleChat;
