import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const FileLogo = (mode) => {
    const pdfUrl = "http://res.cloudinary.com/dqiiudstx/image/upload/v1734520225/nrf0s6cq8gq4pgmv995j.pdf"; // Replace with your PDF URL

    const handleDownload = () => {
        if (mode) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'sample.pdf';
            link.click();
        } else {
            alert('Download is disabled in the current mode.');
        }
    };

    return (
        <div>
            <h1>PDF Viewer</h1>
            {/* PDF Preview */}
            <div style={{ border: '1px solid #ddd', padding: '10px', maxWidth: '800px', margin: '0 auto' }}>
                <Document file={pdfUrl}>
                    <Page pageNumber={1} />
                </Document>
            </div>
            
            {/* Download Button */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={handleDownload} disabled={!mode}>
                    {mode ? 'Download PDF' : 'Download Disabled'}
                </button>
            </div>
        </div>
    );
};

export default FileLogo;
