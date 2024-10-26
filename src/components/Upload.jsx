import React, { useState, useContext } from 'react';
import axios from 'axios';
import MyContext from './MyContext';
import {X} from 'react-bootstrap-icons';

function Upload() {
  const [files, setFiles] = useState([]);
  const [showUploadProgress,setShowUploadProgress] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const {apiKey, endpoint} = useContext(MyContext);
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };
  const handleUpload = async (event) => {
    event.preventDefault();
    
    if (files.length === 0) {
      setShowUploadProgress(true);
      setMessage("Please select at least one file!");
      setShowProgress(false); // Ensure this is false if no files are selected
      return;
    }
  
    setShowUploadProgress(true); // Show the overall upload progress container
    setShowProgress(false); // Reset showProgress state
    setUploadProgress(0); // Reset the progress bar
  
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: { apiKey },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted); // Update progress percentage
          setMessage('Upload In Progress'); // Update message
          setShowProgress(true); // Ensure progress bar is shown during upload
        }
      });
  
      setShowUploadProgress(false); // Hide overall upload container after completion
      setShowProgress(false); // Hide progress bar after upload completes
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading files', error);
      setShowUploadProgress(false); // Hide overall upload container on error
      setShowProgress(false); // Hide progress bar on error
    }
  };
  

  return (
    <>
    { showUploadProgress && 
    <div style={{backgroundColor: 'lightgrey', border: '2px grey solid', width: '350px', height: '150px', borderRadius: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', postion: 'relative'}}> 
        <X onClick={()=> setShowUploadProgress(false)}  style={{fontSize: '40px', position: 'absolute', top: '10px', right: '20px'}} /> 
        <div style={{margin: '10px'}} >{message}</div>
        { showProgress &&
        <div style={{backgroundColor: 'blue', width: `${uploadProgress}%`, height: '20px', position: 'absolute', left: '10px', top: '80px'}}>

        </div>
        }
    </div>

    }

    <h1>Upload </h1>
    <form onSubmit={handleUpload}>
      <input 
        type="file" 
        accept=".pdf, .jpeg, .jpg, .png" 
        multiple 
        onChange={handleFileChange} 
      />
      <button type="submit">Upload Files</button>
    </form>
    </>
  );
}

export default Upload;
