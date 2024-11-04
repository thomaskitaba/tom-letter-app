import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import MyContext from './MyContext';
import { X } from 'react-bootstrap-icons';
import {delay} from './Utility';


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
    setMessage('Scanning for virus then Uploading In Progress');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/scanupload', formData, {
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

      console.log(response.data);
      setMessage('Upload successful!');
      await delay(3000);
      setShowUploadProgress(false);
      setShowProgress(false);
     
    
    } catch (error) {
      console.error('Error uploading files', error);

      delay(3000)
      setShowUploadProgress(false);
      
      setShowProgress(false);
      setMessage('Upload failed. Please try again.');
    }
    setFiles([]); // Reset files state
      if (inputFileRef.current) {
        inputFileRef.current.value = ''; // Clear the input value
      }
    setShowUploadButton(true);
  };

  return (
    <>
      {showUploadProgress && 
        <div className="bg-gray-200 border-2 border-gray-500 w-[350px] h-[150px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center"
>
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
              className="bg-blue-700  h-[20px] absolute left-[10px] top-[85px]"
              style={{width: `${uploadProgress - 6}%`}}
            />
          }
        </div>
      }
      <div className="flex-row gap-4 p-4 bg-yellow-400">
      <h1>Upload</h1>
      <form onSubmit={handleUpload}>
        <label htmlFor="file-upload" style={{ display: 'none' }}>Upload</label>
        <input 
          ref={inputFileRef}
          id="file-upload" 
          name="files"
          type="file" 
          accept=".pdf, .jpeg, .jpg, .png" 
          multiple 
          onChange={handleFileChange}
          onClick={() => setShowUploadProgress(false)}
        />
        <div data-testid="file-length" style={{display: 'none'}} >{files.length}</div>
        {showUploadButton && <button type="submit" className="bg-blue-400 rounded px-4 py-2  hover:bg-blue-600">Upload Files</button>}
      </form>
      </div>
    </>
  );
}

export default Upload;





