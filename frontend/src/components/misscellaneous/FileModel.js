import { LinkIcon } from '@chakra-ui/icons';
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
    FormLabel,
    Input,
    Checkbox,
    useToast
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDisclosure } from '@chakra-ui/hooks';

const FileModel = ({ user, children, onFileSelect, onModeSelect }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [mode, setMode] = useState(true); // Initialize with "true" as default
    const [file, setFile] = useState(null);
    const toast = useToast();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleModeChange = (e) => {
        const newMode = e.target.checked; // Get the checked state of the checkbox
        setMode(newMode); // Update local mode state
        onModeSelect(newMode); // Call parent onModeSelect callback
    };

    const handleSubmit = async () => {

        if (file) {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dqiiudstx");

            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/dqiiudstx/image/upload", {
                    method: 'post',
                    body: data,
                });

                const cloudinaryData = await res.json();

                if (res.ok) {
                    onFileSelect(cloudinaryData.url); // Call onFileSelect with the file URL
                } else {
                    console.error("Upload failed:", cloudinaryData.error.message);
                }
            } catch (err) {
                console.log("File upload error:", err);
                toast({
                    title: "Error uploading file",
                    description: "There was an error uploading the file.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }

        onClose();
    };

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    d={{ base: "flex" }}
                    icon={<LinkIcon />}
                    onClick={onOpen}
                />
            )}

            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <FormControl mb={4}>
                            <FormLabel>Choose a File</FormLabel>
                            <Input type="file" onChange={handleFileChange} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Access Mode</FormLabel>
                            <Checkbox
                                isChecked={mode}
                                onChange={handleModeChange}
                            >
                                View Only
                            </Checkbox>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default FileModel;
