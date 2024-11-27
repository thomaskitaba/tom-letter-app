import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import MyContext from "./MyContext";
import {FileText, FileEarmarkText, ArrowRight, ArrowLeft } from 'react-bootstrap-icons';
import DownloadFile from "./DownloadFile";

const FileDatabase = () => {

    const [files, setFiles] = useState([]);
    const [fileToDownload, setFileToDownload] = useState(null);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(3);
    const [totalPages, setTotalPages] = useState(1);

    const [searchTerm, setSearchTerm] = useState(""); // New state for search term
    const { endpoint, apiKey, DBUpdated, setDBUpdated } = useContext(MyContext);  // Assume endpoint and apiKey come from MyContext

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${endpoint}/api`, {
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
    }, [page, limit, apiKey, DBUpdated]);

    // Filter files based on the search term
    const filteredFiles = files.filter(file =>
        file.FileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.Title.toLowerCase().includes(searchTerm.toLowerCase()) // Filtering by both FileName and Title
    );

    const handleDownload = async () => {
        try {
            setFileToDownload("Thomas Kitaba")
            const response = await axios.post(
                `${endpoint}/api/download`, 
                { fileToDownload: fileToDownload }, // Send the filename in the request body
                {
                  headers: {
                    'Content-Type': 'application/json', // Use JSON as the content type
                  },
                  params: { apiKey }, // Send API key as a query parameter
                  responseType: 'blob', // Set the response type to 'blob' to receive binary data
                }
              );
              console.log("Download Success");
            // Create a URL and trigger a download
            // Create a Blob URL from the response data to represent the file as a URL
            const url = window.URL.createObjectURL(new Blob([response.data]));
            // Create a new anchor (`<a>`) element to trigger the file download
            const link = document.createElement("a");
            // Set the `href` attribute of the link to the Blob URL created earlier
            link.href = url;
            // Set the `download` attribute to specify the filename for the downloaded file
            link.setAttribute("download", fileToDownload);
            // Append the anchor element to the document body (it must be in the DOM to trigger click)
            document.body.appendChild(link);
            // Programmatically trigger the click event to start the file download
            link.click();
            // Remove the link element from the DOM after the download has been triggered
            link.remove();
        
        } catch (error) {
          console.error(err);
          alert("Error downloading file");
        }
      };
    
    return (
        <div className="bg-white ">
            <h1>File Database</h1>
            {/* Search input to filter files */}
            <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', padding: '5px' }}
            />
            <div className="bg-gray-100 pl-4 flex flex-wrap justify-center p-4 gap-4">
                {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                        <div key={file.FileId} className="bg-yellow-200 flex-row justify-end p-6 w-[250px] min-h-1 shadow-lg border-black rounded-xl">
                            <h3>{file.FileName}</h3>
                            <p><strong>Title:</strong> {file.Title}</p>
                            <p><strong>Status:</strong> {file.Status}</p>
                            <p><strong>DateCreated</strong>{file.DateWritten}</p>
                            {/* Display PDF thumbnail, click to open file */}
                            <FileText 
                            style={{fontSize: '50px', cursor: 'pointer'}}
                            onClick={() => window.open(`http://localhost:5000/files/${file.FileLocalLocation}`, '_blank')}
                            />
                            <p>{file.Description}</p>
                            <button type="submit" className="bg-blue-400 rounded my-2 px-4 py-2  hover:bg-blue-600 hover:text-white self-end" onClick={() => { 
                            setFileToDownload(file.FileName); 
                            handleDownload(); // Invoke the function
                        }}> Download </button>
                            {/* <imgs
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




  