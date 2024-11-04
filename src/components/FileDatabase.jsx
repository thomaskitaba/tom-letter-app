import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import MyContext from "./MyContext";
import {FileText, FileEarmarkText, ArrowRight, ArrowLeft } from 'react-bootstrap-icons';


const FileDatabase = () => {

    const [files, setFiles] = useState([]);
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(3);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // New state for search term
    const { endpoint, apiKey } = useContext(MyContext);  // Assume endpoint and apiKey come from MyContext

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api`, {
                    params: { page, limit, apiKey },
                    headers: {
                        'Content-type': 'application/json',
                    }
                });
                setFiles(response.data.results);
                setTotalPages(response.data.additionalInfo.totalPages); // Handle total pages for pagination
                // console.log(response.data.results);
            } catch (error) {
                console.error('Error fetching PDF files:', error);
            }
        };

        fetchFiles();
    }, [page, limit, apiKey]);

    // Filter files based on the search term
    const filteredFiles = files.filter(file =>
        file.FileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.Title.toLowerCase().includes(searchTerm.toLowerCase()) // Filtering by both FileName and Title
    );

    return (
        <div className="bg-lime-300 pl-4">
            <h1>File Database</h1>
            {/* Search input to filter files */}
            <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', padding: '5px' }}
            />
            <div className="bg-green-200 pl-4">
                {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                        <div key={file.FileId} >
                            <h3>{file.FileName}</h3>
                            <p><strong>Title:</strong> {file.Title}</p>
                            <p><strong>Status:</strong> {file.Status}</p>
                            
                            {/* Display PDF thumbnail, click to open file */}
                            <FileText 
                            style={{fontSize: '50px', cursor: 'pointer'}}
                            onClick={() => window.open(`http://localhost:5000/files/${file.FileLocalLocation}`, '_blank')}
                            />
                            {/* <img
                                src="/pdf-thumbnail.png" // You can replace this with actual thumbnail generation
                                alt={file.FileName}
                                onClick={() => window.open(`http://localhost:5000/files/${file.FileLocalLocation}`, '_blank')}
                                style={{ cursor: 'pointer', width: '100px', height: '140px', padding: '50px', border: '2px solid', backgroundColor: 'green' }}
                            /> */}
                        </div>
                    ))
                ) : (
                    <p>No files found.</p>
                )}
            </div>
            <div>
                {/* Pagination buttons */}
               
                <button 
                    disabled={page <= 1} 
                    onClick={() => {console.log(page); setPage(page - 1)}}
                >
                    <ArrowLeft style={{ fontSize: '1.25rem'}}/>
                </button>
                <button 
                    disabled={page >= totalPages} 
                    onClick={() => { console.log(page);setPage(page + 1)}}
                >
                    <ArrowRight style={{ fontSize: '1.25rem'}} />
                </button>
            </div>
            <div><p>prev:{page - 1} cur:{page} next:{page + 1}</p></div>
        </div>
    );
};

export default FileDatabase;
