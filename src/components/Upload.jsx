import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import MyContext from './MyContext';
import { X } from 'react-bootstrap-icons';

function Upload() {
  const [files, setFiles] = useState([]);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [showUploadButton, setShowUploadButton] = useState(true);
  const { apiKey, endpoint } = useContext(MyContext);
  const inputFileRef = useRef(null);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (files.length === 0) {
      setShowUploadProgress(true);
      setMessage("Please select at least one file!");
      setShowProgress(false);
      return;
    }
    setShowUploadProgress(true);
    setShowProgress(false);
    setUploadProgress(0);
    setMessage('Upload In Progress');
  
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
  
    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: { apiKey },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
          setShowProgress(true);
          setShowUploadButton(false);
        }
      });
  
      setFiles([]); // Reset files state
      if (inputFileRef.current) {
        inputFileRef.current.value = ''; // Clear the input value
      }
      setFiles([]);
      await new Promise(resolve => setTimeout(resolve, 0)); // Allow state update
  
      setShowUploadProgress(false);
      setShowProgress(false);
      setShowUploadButton(true);
      setMessage('Upload successful!');
    } catch (error) {
      console.error('Error uploading files', error);
      setShowUploadProgress(false);
      setShowProgress(false);
      setMessage('Upload failed. Please try again.');
    }
  };
  

  return (
    <>
      {showUploadProgress && 
        <div style={{
          backgroundColor: 'lightgrey',
          border: '2px grey solid',
          width: '350px',
          height: '150px',
          borderRadius: '20px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <X onClick={() => setShowUploadProgress(false)} style={{
            fontSize: '40px',
            position: 'absolute',
            top: '10px',
            right: '20px'
          }} />
          <div style={{ margin: '10px' }}>{message}</div>
          {showProgress && 
            <div 
              role="progressbar" 
              style={{
                backgroundColor: 'blue',
                width: `${uploadProgress - 6}%`,
                height: '20px',
                position: 'absolute',
                left: '10px',
                top: '80px'
              }} />
          }
        </div>
      }
      <h1>Upload</h1>
      <form onSubmit={handleUpload}>
        <label htmlFor="file-upload" style={{ display: 'none' }}>Upload</label>
        <input 
          ref={inputFileRef} 
          id="file-upload"  
          type="file" 
          accept=".pdf, .jpeg, .jpg, .png" 
          multiple 
          onChange={handleFileChange} 
          onClick={() => setShowUploadProgress(false)}
        />
        {/* Optionally expose the state for testing */}
        <div data-testid="file-length" style={{display: 'none'}}>{files.length}</div>
        {showUploadButton && <button type="submit">Upload Files</button>}
      </form>
    </>
  );
}

export default Upload;
