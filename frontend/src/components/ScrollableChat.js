import React, { useState } from 'react';
import scrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/chatLogics';
import { ChatState } from '../Context/CheckProvider';
import { Avatar, Tooltip, Box, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { saveAs } from 'file-saver';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the workerSrc for react-pdf
/*pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();*/
//pdfjs.GlobalWorkerOptions.workerSrc = '/path/to/pdf.worker.min.js';
if (process.env.NODE_ENV === 'production') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
} else {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}


//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/pdfjs-dist@4.9.155/pdf.worker.min.js`;

//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js`;
//pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


const ScrollableChat = ({ messages, mode }) => {
  const { user } = ChatState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
 

  // Open modal and set the PDF to view
  //?console.log(messages.);
  const handleViewPdf = (pdfUrl) => {
    setCurrentPdf(pdfUrl);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPdf(null);
    setPageNumber(1); // Reset the page number when closing the modal
  };

  // Function to check if the content is a URL ending with .pdf
  const renderMessageContent = (content,mode) => {

    // Basic regex to check if the link starts with http and ends with .pdf
    const pdfLinkRegex = /^http.*\.pdf$/;
    const imageLinkRegex = /^http.*\.(jpg|jpeg|png)$/i;


    // Check if the message content is a PDF URL

    if (pdfLinkRegex.test(content)) {
      return (
        <Box>
          {mode ? (
            <Button
              colorScheme="blue"
              mt={2}
              onClick={() => saveAs(content, 'file.pdf')} // Download the file
            >
              Download PDF
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              mt={2}
              onClick={() => handleViewPdf(content)} // Open PDF in modal
            >
              View PDF
            </Button>
          )}
        </Box>
      );
    }
    if (imageLinkRegex.test(content)) {
      return <img src={content} alt="Embedded" width="100%" height="50px" />;
    }



    // If it's not a PDF URL, return the regular text message
    return <Text>{content}</Text>;
  };

  // Callback function to handle PDF loading
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Function to navigate to next page
  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  // Function to navigate to previous page
  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <>
      <scrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div style={{ display: 'flex' }} key={m._id}>
              {/* Show sender's avatar if it's the same sender or the last message */}
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                  <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )}

              {/* Message container */}
              <span
                style={{
                  backgroundColor: `${m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'}`,
                  borderRadius: '20px',
                  padding: '5px 15px',
                  maxWidth: '75%',
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
              >
                {renderMessageContent(m.content,m.mode)} {/* Render message content */}
              </span>
            </div>
          ))}
      </scrollableFeed>

      {/* Modal for PDF viewing */}
      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>PDF Viewer</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style={{
              height: '60vh', // Set a fixed height for the modal body
              overflowY: 'auto', // Enable vertical scrolling
            }}
          >
            {currentPdf && (
              <>
                <div
                  style={{
                    width: '100%',
                    height: '500px', // Adjust for the navigation buttons calc(100% - 50px)
                    overflowY: 'scroll',
                  }}
                >
                  <Document file={currentPdf} onLoadSuccess={onLoadSuccess} renderTextLayer={false} renderAnnotationLayer={false} an onLoadError={(error) => console.error(error)}>
                    <Page pageNumber={pageNumber} />
                  </Document>
                </div>

                {/* Navigation for pages */}
                <Box mt={4} display="flex" justifyContent="space-between">
                  <Button onClick={prevPage} isDisabled={pageNumber <= 1}>
                    Previous
                  </Button>
                  <Text>
                    {pageNumber} of {numPages}
                  </Text>
                  <Button onClick={nextPage} isDisabled={pageNumber >= numPages}>
                    Next
                  </Button>
                </Box>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ScrollableChat;
