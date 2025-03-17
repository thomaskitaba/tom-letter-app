import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import MyContext from "./MyContext";
import {FileText, FileEarmarkText, ArrowRight, ArrowLeft } from 'react-bootstrap-icons';
import DownloadFile from "./DownloadFile";

const FileDatabase = () => {

    const [files, setFiles] = useState([]);
    const [fileToDownload, setFileToDownload] = useState(null);
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const [paginationButtons, setPaginationButtons] = useState(page);
    const [arrayOfPages, setArrayOfPages] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [showDownloadStatus, setShowDownloadStatus] = useState(false);
    const [downloadMessage, setDownloadMessage] = useState("");
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
        
        // if (page > 20) {
        //     setPaginationButtons(10);
        //     setArrayOfPages([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        // }else {
        //     setPaginationButtons(Math.min(5, totalPages));
        //     const temp = []
        //     for (let i = 1; i <= Math.min(5, totalPages); i++) {
        //         temp.push(i);
        //     }
        //     setArrayOfPages(temp);
        // }
        
        fetchFiles();
    }, [page, limit, apiKey, arrayOfPages, DBUpdated]);

    const handleShowDownloadMessage = () => {
        setShowDownloadStatus(true);
        setTimeout(() => {
            setShowDownloadStatus(false);
        }, 3000);
    }
    // Filter files based on the search term

    const filteredFiles = files.filter(file =>
        file.FileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.Title.toLowerCase().includes(searchTerm.toLowerCase()) // Filtering by both FileName and Title
    );

    const handleDownload = async (fileName) => {
        try {
            const response = await axios.post( 
                `${endpoint}/api/download`, 
                { fileName}, // Send the filename in the request body
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
            // setShowDownloadStatus(false);
        } catch (error) {
            if (statusCode === 404) {
                setDownloadMessage(serverMessage || "File not in repository, shake your Database");
              } else {
                // Handle other error statuses
                setDownloadMessage("Error sendind Download link")
              }
              handleShowDownloadMessage();
          }
      };
    
    return (
        <>
        { showDownloadStatus &&
        <div className="absolute bg-blue-100 rounded-lg w-[200px] h-[100px] p-4 transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 item-center">
            {downloadMessage}
        </div>
        } 
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
                            <div className="flex justify-center gap-2 bg-grey-100 rounded-lg">
                                <button type="submit" className="bg-blue-500 rounded my-2 px-4 py-2 text-white hover:bg-blue-600 hover:text-yellow-200 self-end" onClick={() => { 
                                setFileToDownload(file.FileName); 
                                handleDownload(file.FileName); // Invoke the function    
                            }}> Download </button>

                            <button type="submit" className="bg-blue-500 rounded my-2 px-4 py-2 text-white hover:bg-blue-600 hover:text-yellow-200 self-end" onClick={() => { 
                                setFileToDownload(file.FileName); 
                                handleFileEdit(); // Invoke the function
                            }}> Edit </button>
                        </div>
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
            <div className="flex gap-2 align-center justify-start">
                {/* Pagination buttons */}
                <div className="my-4">
                    <button className="pagination-buttons"
                        disabled={page <= 1} 
                        onClick={() => {console.log(page); setPage(page - 1)}}
                    >
                
                        <ArrowLeft style={{ fontSize: '1.25rem'}}/>
                    </button>
                </div>
                {/* { arrayOfPages.map((page, index) => { return (
                <div className=" my-4 flex justify-center border-2 w-[30px] border-blue-400">
                    <button className="pagination-buttons" key={index} onClick={() => setPage(page)}>{page}</button>
                </div>
                )
                })
                } */}
                <div className=" my-4 flex justify-center border-2 w-[30px] border-blue-400">
                    {page}
                </div>

                <div className="my-4">
                <button className="pagination-buttons"
                    disabled={page >= totalPages} 
                    onClick={() => { setPage(page + 1)}}
                >
                    <ArrowRight style={{ fontSize: '1.25rem'}} />
                </button>
                </div>
                <div className="flex gap-2 m-4 w-fit ">
                <div className="pagination-buttons" onClick={(e) => {setLimit(2); setPage(1)}}>5</div>
                <div className="pagination-buttons" onClick={(e) => {setLimit(10); setPage(1)}}>10</div>
                <div className="pagination-buttons" onClick={(e) => {setLimit(20); setPage(1)}}>20</div>
                <div className="pagination-buttons" onClick={(e) => {setLimit(30); setPage(1)}} >30</div>
                <div className="pagination-buttons" onClick={(e) => {setLimit(40); setPage(1)}}>40</div>
            </div>
            </div>   
            <div className="flex gap-2 m-4"><p>prev:{page - 1} cur:{page} next:{page + 1} </p></div>
        </div>
    </>
    );
};

export default FileDatabase;




