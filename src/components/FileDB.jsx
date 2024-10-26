import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import MyContext from "./MyContext";
import { ArrowRight, ArrowLeft } from 'react-bootstrap-icons';

const FileDB = () => {

    const [files, setFiles] = useState([]);
    const [limit, setLimit] = useState(3);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // New state for search term
    const { endpoint, apiKey } = useContext(MyContext);  // Assume endpoint and apiKey come from MyContext
    

    // 1. write function fetch that uses axio  to send get request
    // 2. write the frontend code to display the data
    
    useEffect (() => {
      const fetchData = async() => {
        try {
        const response = await axios.get(`${endpoint}/api`,
          {
            params: {limit, page, apiKey},
            headers: { 'Content-Type': 'application/json'}
          }
        )
        setFiles(response.data.results);
        setTotalPages(response.data.results.totalPages)
        console.log(response.data.results);
      } catch(error) {
        console.error('error occured');
      }
      }
      fetchData()
    }, [limit, page, apiKey])

    const filteredFiles = files.filter(file => 
      file.FileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.Title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <>
      <div>
       {
        filteredFiles.length > 0 ? (
          filteredFiles.map((file, index) => (
            <>
              <p> {file.Title} </p>
              <p> {file.FileName} </p>
              <img
                src="/pdf-thumbnail.png" // You can replace this with actual thumbnail generation
                alt={file.FileName}
                onClick={() => window.open(`http://localhost:5000/files/${file.FileLocalLocation}`, '_blank')}
                style={{ cursor: 'pointer', width: '100px', height: '140px', padding: '50px', border: '2px solid', backgroundColor: 'green' }}
              />
            </>
          ))
        ) :
        (
        <div>
          <p> No Files Found </p>
        </div>
        )
       }
       </div>
       <div>
          <LeftArrow /> {/* Backward */}
          <RightArrow /> {/* Forward */}
       </div>
      </>
    )
}

export default FileDB;
