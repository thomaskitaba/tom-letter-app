import React, { useState, useEffect } from 'react';

const PdfViewer = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch PDF files from the backend server
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:5000/pdfs'); // Adjust to your backend URL
        const files = await response.json();
        setPdfFiles(files);
      } catch (error) {
        console.error('Error fetching PDF files:', error);
      }
    };

    fetchFiles();
  }, []);

  // Filter PDF files based on search term
  const filteredFiles = pdfFiles.filter(file =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>PDF Viewer</h1>
      <input
        type="text"
        placeholder="Search for PDFs"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="pdf-thumbnails">
        {filteredFiles.map((file, index) => (
          <div key={index} className="pdf-thumbnail">
            <img
              src="/pdf-thumbnail.png" // You can replace this with actual thumbnail generation
              alt={file}
              onClick={() => window.open(`http://localhost:5000/files/${file}`, '_blank')}
              style={{ cursor: 'pointer', width: '100px', height: '140px', padding: '50px', border: '2px solid', backgroundColor: 'red' }}
            />
            <p>{file}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfViewer;
