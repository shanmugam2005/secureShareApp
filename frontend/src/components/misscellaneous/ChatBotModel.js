import { ChatIcon } from '@chakra-ui/icons';
import {
    Button,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    FormControl,
    Input,
    Text,
    VStack,
    useToast,
    Spinner,
    Box
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';

const ChatBoxModel = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSend = async () => {
        if (!prompt.trim()) {
            toast({
                title: "Error",
                description: "Please enter a prompt.",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/chatBot/response', { prompt });
            console.log(data.response.candidates);
            setResponse(data.response); // Update this based on your API's response structure
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch response.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
        setLoading(false);
    };

    return (
        <>
            <IconButton
                d={{ base: "flex" }}
                icon={<ChatIcon />}
                onClick={onOpen}
                aria-label="Open Chat"
            />

            <Modal size="sm" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="20px"
                        fontFamily="Work sans"
                        textAlign="center"
                    >
                        ChatBot
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <Input
                                    placeholder="Enter your prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    isDisabled={loading}
                                />
                            </FormControl>
                            <Button
                                colorScheme="blue"
                                onClick={handleSend}
                                isLoading={loading}
                                isDisabled={loading}
                            >
                                Send
                            </Button>

                            {loading && (
                                <Box p={3} textAlign="center" bg="gray.50" borderRadius="md">
                                    <Spinner size="sm" />
                                    <Text mt={2} fontSize="sm">Generating response...</Text>
                                </Box>
                            )}

                            {response && !loading && (
                                <Box
                                    p={3}
                                    bg="gray.100"
                                    borderRadius="md"
                                    fontSize="sm"
                                    overflowY="auto"
                                    maxH="200px"
                                    boxShadow="lg"
                                    transition="all 0.3s ease-in-out"
                                    _hover={{ transform: 'scale(1.02)', boxShadow: 'xl' }}
                                >
                                    <Text>{response}</Text>
                                </Box>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} colorScheme="red">
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ChatBoxModel;
