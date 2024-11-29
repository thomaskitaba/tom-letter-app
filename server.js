


import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from 'dotenv';
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import axios from "axios";
import fs from "fs";
import multer from 'multer';
import FormData from 'form-data';

// import {calculateFileSize} from './src/components/Utility';
// import { delay } from './src/components/Utility';

const router = express.Router();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
const port = 5000;
app.listen(port, () => console.log("tom-letter-app Server is Running"));
const socket = new WebSocket(`ws://localhost:${port}/`);
dotenv.config();

// Apply authentication middleware to all routes that need protection
// TODO:sqlite3 database configuration
// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const myDatabase = path.join(__dirname, 'files.db');
const db = new sqlite3.Database(myDatabase, sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
});

// Other ES module imports
// require('dotenv').config();

const password = process.env.VITE_PASSWORD;
const email = process.env.VITE_EMAIL;
const virusTotal=process.env.VITE_VIRUSTOTALKEY;
// server used to send send emails

let table = ''
let tableSelect = ''
let tableQuery = ''
const pdfFolderPath = path.join(__dirname, 'files'); // Ensure the path is correct
app.use('/files', express.static(pdfFolderPath)); // Serving the files folder


//todo: Set up storage to save files in the "files" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'files'));
  },
  filename: (req, file, cb) => {
    cb(null, file[i].originalname);
  }
});
// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|pdf/; // Allowed file extensions
  const extname = fileTypes.test(path.extname(file[i].originalname).toLowerCase()); // Check extension
  const mimetype = fileTypes.test(file.mimetype); // Check MIME type
  
  if (extname && mimetype) {
    return cb(null, true); // File type is allowed
  } else {
    cb(new Error('Error: Only PDFs, JPEGs, and PNGs are allowed!'), false); // Reject file
  }
};
// Initialize multer with storage and file filter
let upload = multer({ storage, fileFilter });

// TODO: API Middleware
const authenticate = (req, res, next) => {
  const providedApiKey = req.headers['apiKey'] || req.query.apiKey;
  const apiKey = process.env.VITE_API_KEY;
  
  if (providedApiKey && providedApiKey === apiKey) {
    next(); // Proceed to the next middleware/route handler
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
// Apply middleware to specific routes, for example, '/api'
app.use('/api', authenticate);
// todo: end of middleware

// TODO: Utility Functions

// todo:--- 1. delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// todo:--- 2. calculateFileSize function

const calculateFileSize = (fileSize) => {
    if (fileSize >= 1024 && fileSize < (1024 * 1024)) {
      fileSize = `${fileSize / 1024} KB`;
    }else if (fileSize >= (1024 * 1024) && fileSize < (1024 * 1024 * 1024)) {
      fileSize = `${Math.ceil(fileSize / (1024 * 1024))} MB`;
    }
  }

// TODO: SEND EMIAL USING nodemailer 
const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: password
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Connect your contact form to /send-mail endpoint ");
  }
});

// router.get("/", (req, res) => {
//   res.json({ message: "Welcome to tom-mail sender, this web api can only be used after contacting Thomas Kitaba, and any enitity using this api for any use should have persmission from Thomas Kitaba" });
// });

router.post("/contact", (req, res) => {
  console.log('Received contact form submission:', req.body);
  const {fname, lname, phone, message, email} = req.body;
  console.log(JSON.stringify(req.body));
  // const name = req.body.firstName + req.body.lastName;
  // const fname = req.body.fname;
  // const message = req.body.message;
  // const phone = req.body.phone;
  const mail = {
    from: `${fname} ${lname}`,
    to: "thomaskitabadiary@gmail.com",
    subject: `from ${email}`,
    html: `<p>Name: ${fname} ${lname}</p>
          <p>Email: ${email}</p>
          <p>Phone: ${phone}</p>
          <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});

router.post("/order", (req, res) => {
  // console.log('Received Order:', req.body);
  const {order, customerType, orderLocation, specialRequest, totalPrice} = req.body;
  console.log(`Recived Order: ${JSON.stringify(req.body)}`);

  const mail = {
    from: `${orderLocation}`,
    to: "thomaskitabadiary@gmail.com",
    subject: `location: ${orderLocation}   | CustomerType: ${customerType}`,
    html: `<p>location: ${orderLocation} </p>
          <p>customer type: ${customerType}</p>
          <p>special request: ${specialRequest}</p>
          <div> Order: ${order.map((item, index) => `<h4>${index + 1} Item: ${item.name}   | Quantity:  ${item.quantity}</h4> <p>Price=> ${item.price} </p>`).join('   ')}</div>
           <h3>  Total Price: ${totalPrice}</h3>
          `,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});

// todo: end of EMAIL SENDING CODE

//  DATABASE TABLE and VIEWS
const Files = "SELECT * FROM File";
const Company = "SELECT * FROM Company";
const CompanyType = "SELECT * FROM Company";
const FileType = "SELECT * FROM FileType";
const Incoming = "SELECT * FROM Incoming";
const Outgoing = "SELECT * FROM Outgoing";

const FilesSelect = "SELECT * FROM File WHERE FileId > ? AND FileId <= ?";
const CompanySelect = "SELECT * FROM Company WHERE CompanyId > ? AND CompanyId <= ?";
const CompanyTypeSelect = "SELECT * FROM CompanyType WHERE CompanyTypeId > ? AND CompanyTypeId <= ?";
const FileTypeSelect = "SELECT * FROM FileType WHERE FileTypeId > ? AND FileTypeId <= ?";
const IncomingSelect = "SELECT * FROM Incoming WHERE IncomingId > ? AND IncomingId <= ?";
const OutgoingSelect = "SELECT * FROM Outgoing WHERE OutgoingId > ? AND OutgoingId <= ?";

const FileQuery = "SELECT COUNT(*) as count FROM File";

// SUPPORTING FUNCTIONS
// PAGINATION MIDDLEWARE
  
const countRows = (modelQuery) => {
  return new Promise((resolve, reject) => {
    db.all(modelQuery, [], (err, rows) => {
      if (err) {
        console.log("Error fetching total rows:", err);
        reject(err.status(500).json({ error: err.message }));
      } else {
        resolve(rows[0].count);  // Resolve with the count of rows
      }
    });
  });
};

// TODO: PAGINATION MIDDLEWARE
function paginateResults(model, modelSelect, modelQuery) {
  // This is the middleware function that Express expects
  return async (req, res, next) => {
    try {
      const totalRows = await countRows(modelQuery);
      
      const page = parseInt(req.query.page) || 1;  // Default page is 1 if not provided
      const originallimit = parseInt(req.query.limit) || 10;  // Default limit is 10 if not provided
      const limit = isNaN(originallimit) ? 10 : originallimit;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const additionalInfo = {};
      const totalPages = Math.ceil(totalRows / limit);
      if (page > 1) {
        additionalInfo.previousPage = page - 1;
      }
      if (page < totalPages) {
        additionalInfo.nextPage = page + 1;
      }

      db.all(modelSelect, [startIndex, endIndex], (err, rows) => {
        if (err) {
          console.log("Error while fetching paginated results:", err);
          return res.status(500).json({ error: err.message });
        }
        res.paginateResults = {
          results: rows,
          additionalInfo: {
            ...additionalInfo,
            totalPages,
            totalRows,
          },
        };
        next(); // Pass control to the next middleware or route handler
      });
    } catch (error) {
      if (res.statusCode !== 200) {
        return res.status(error.statusCode).json({error: "Error Fetching rowCount"});
      }
    }
  };
}

  app.get("/api", paginateResults(File, FilesSelect, FileQuery), (req, res) => {
    res.json(res.paginateResults)
  })

  // todo: =============== END OF PAGINATION ================
  

  app.get("/paginate", async (req, res) => {

    const tableName = req.query.tableName;
    const limit = parseInt(req.query.limit) || 1;
    const page = parseInt(req.query.page) || 10;

    // set the the global variable to be used while pagination
    table = `SELECT * FROM ${tableName}`
    tableSelect = `SELECT COUNT(*) as count FROM ${table}`

    if (tableName == "File") {
      tableQuery = `SELECT * FROM ${tableName} WHERE FileId > ? AND FileId <= ?`; 
    }  else if (tableName == "Company") {
      tableQuery = `SELECT * FROM ${tableName} WHERE CompanyId > ? AND CompanyId <= ?`;
    } else if (tableName == "Incoming") {
      tableQuery = `SELECT * FROM ${tableName} WHERE IncomingId > ? AND IncomingId <= ?`;
    } else if (tableName == "Outgoing") {
      tableQuery = `SELECT * FROM ${tableName} WHERE OutgoingId > ? AND OutgoingIds <= ?`;
    }
    // use axios to make request for "/"
    // Use axios to make request for "/api"
  try {
    const response = await axios.post('/api', {
      tableName: tableName,
      countQuery: tableSelect,
      query: tableQuery
    }, {
      headers: {
        'Content-type': 'application/json',
        'x-api-key': apiKey,
      }
    });
    console.log("Successful");
    res.json(response.data); // Send the response data back to the client
  } catch (error) {
    console.error("Error in /test:", error);
    res.status(500).json({ message: 'Unable to confirm' });
  }
  })
  // TODO: ENDPONTS / ROUTS============================================

  // TODO: FILE VIEWER
  

app.get('/', (req, res)=> {
  res.status(200).json({message: "Welcome to the file viewer"});
  console.log("Welcome to the file viewer");
})
// Route to get the list of PDF files
app.get('/pdfs', (req, res) => {
  fs.readdir(pdfFolderPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    res.json(pdfFiles);
  });
});


// todo: original code
// const virusCheckMiddleware = async (req, res, next) => {
//   // console.log(JSON.stringify(req.files))
//   if (req.files && req.files.length > 0) {

//     try {
//       console.log(req.files)
//       const response = await checkFileWithVirusTotal(req.files[0]);
//       console.log("Malicious score:", response.malicious); // Log the score for debugging

//       // Check for a non-malicious file (adjusted to simulate your test case)
//       if (response && response.malicious == 0) {
//         console.log("File is safe to upload");
//         return next(); // Only call next if the file is safe
//       } else {
//         // If the file is malicious or an error is flagged, respond with an error
//         console.log("File is malicious or an error occurred");
//         return res.status(400).json({ error: response.error || "File is malicious" });
//       }
//     } catch (error) {
//       console.error("Error scanning file:", error);
//       return res.status(500).json({ error: "Error occurred while scanning for viruses." });
//     }
//   } else {
//     // No files uploaded; return an error
//     return res.status(400).json({ error: 'No files uploaded' });
//   }
// };
// app.post('/api/upload', upload.array('files', 4), async (req, res) => {
//   console.log("inside upload route");
//   console.log(req.files)
//   try {
//     // Assuming the file is safe after the middleware check
//     res.json({ message: 'File uploaded and scanned successfully', result: req.files });
//   } catch (error) {
//     console.log({
//       'Message': "Error occurred while processing the upload",
//       error: error.message
//     });
//     res.status(500).json({ message: 'Error occurred during file upload' });
//   }
// });

// TODO: SCANN FOR VIRUS 

const checkFileAnalyses = async (scanId) => {
  console.log("inside Check file Analysis==============");
  try {
    const response = await axios.get(`https://www.virustotal.com/api/v3/analyses/${scanId}`, {
      headers: {
        'x-apikey': virusTotal,
      }
    });
    // console.log("inside Check file Analysis==============");
    // console.log(response.data.data.attributes.stats);
    // console.log("the file is not infected")
    // console.log("===================end of file Analysis ")
    return(response.data)
  } catch (error) {
    console.error("Error fetching report:", error.response ? error.response.data : error.message);
  }
};

const checkFileWithVirusTotal = async (file) => {
  console.log("inside checkFileWithVirusTotal--------------");
  if (!file && !file.buffer) {
    throw new Error('File not provided');
  }
  // Create a new FormData object
  const formData = new FormData();
  // Append the file to the form data
  formData.append('file', file.buffer, file.originalname);
  // todo: test using testScann.pad
  // const filePath = 'testScann.pdf'; // Ensure this path is correct
  // // Check if the file exists
  // if (!fs.existsSync(filePath)) {
  //   throw new Error(`File not found: ${filePath}`);
  // }
  // formData.append('file', fs.createReadStream(filePath));
//  todo:  end of testdata configurartion
  
  try {
    // Make the API call to VirusTotal
    const headers = formData.getHeaders();  // output is { content-type: multipart/json --bounary}
    const response = await axios.post('https://www.virustotal.com/api/v3/files', formData, {
      headers: {
        ...headers, // Get headers from formData
        'x-apikey': virusTotal, // Set API key
      }
    });
    
    // Check if the response is successful and return the data
    if (response.status === 200) {
      // TODO: analyze the file
      const scanResult = await checkFileAnalyses(response.data.data.id);
     
      // console.log(scanResult);
      return(scanResult.data.attributes.stats)
      // console.log (scanResult.data.data.attributes.stats.malicious)
      // return response.data; // Use 'response.data' directly
    } else {
      throw new Error('Failed to scan file');
    }
  } catch (error) {
    throw new Error(`Error scanning file with VirusTotal: ${error.message}`);
  }
};

// Execute the function and log the result
// TODO: Function call to test   checkFileWithVirusTotal   function
// checkFileWithVirusTotal()
//   .then(data => console.log('Scan Result:', data))
//   .catch(error => console.error('Error:', error.message));

// TODO virsu check middleware


const virusCheckMiddleware = async (req, res, next) => {
  console.log("----inside virusCheckMiddleware----");
  const safeFiles = [];
  const unsafeFiles = [];
  
  
    // the file to be scaned by virusTotal
    const file = req.files;
    console.log("file to be scanned: ", file);
    const uploadPerMinute = 4;

for (let j = 0; j < Math.ceil(file.length / uploadPerMinute); j++) {
      // TODO: check if i + 4  is greater than file.length
      const startIndex = j * uploadPerMinute;
      const endIndex =  Math.min(startIndex + uploadPerMinute, file.length)
      
      for(let i = startIndex; i < endIndex ; i++) {
        console.log(`trying to scann file-${[i]}: ${file[i].originalname}`)
        try{
          const response = await checkFileWithVirusTotal(file[i])
          await delay(10);
          if (response && response.malicious === 0) {
            safeFiles.push(file[i]);
          }else {
            unsafeFiles.push(file[i]);
          }
          console.log(`File-${[i]}: ${file[i].originalname} is safe to upload`);
        }catch(error) {
          console.log(`Error occured while scanning ${file[i].originalname}: ${error.message}`);
        }
      }
      console.log("waiting for 1 minute before scanning the next batch of files");
      await delay(1010);
    }
    if (safeFiles.length > 0) {
      req.files = safeFiles;
      res.locals.safeFiles = safeFiles;
      res.locals.unsafeFiles = unsafeFiles;
      return next();
    }
    else{
      res.status(400).json({"Message": 'all files are unsafe'})
    }
}
// [
//   {
//     "fieldname": "files",          // The field name used in the form
//     "originalname": "example.pdf", // The original name of the file
//     "encoding": "7bit",            // The encoding of the file
//     "mimetype": "application/pdf", // The MIME type of the file
//     "buffer": <Buffer>             // The file content as a buffer (this will be the file data)
//   },
//   {
//     "fieldname": "files",
//     "originalname": "image.png",
//     "encoding": "7bit",
//     "mimetype": "image/png",
//     "buffer": <Buffer>
//   }
// ]
const uploadFilesToDB = async(files) => {
  return new Promise ((resolve, reject) => {
    // TODO:   convert files to rows
  console.log("=====Inside UploaFileToDB=====");
  console.log(files);
  const file = files[0];
  let rows = [];
  
  let fileSize = '';
  let i = 0;
  let j = 0;
  let dateWritten = '';
  const todaysDate = new Date().toISOString().split('T')[0]
  fileSize = calculateFileSize(file.size);
  // fileLocalLocation = file.originalname;
  let title = 'No Title'
  console.log("file buffer@@@@@@@@@@@@@@@@@@@: ", file.size);
  console.log("fileSize: @@@@@@@@@@@@", fileSize);
  //convert file.size to KB or MB
  
  // console.log(form);
  console.log(`formData fields:------`);
  
  if (files && files.length > 0) {
  files.forEach(file => {
    //  i = file.originalname.indexOf('@');
    //  j = file.originalname.length;
    
    // if (i >= 0){
    //   title = title.slice(0, i);
    // }else {
    //   title = file.originalname;
    // }
    // const regexTitle = /^(.*?)\d{2}[-/]\d{2}[-/]\d{4}/
    const regexTitle = /^(.*?)(\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})/;
 const regex = /\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4}/;


// Match the file name against the regex
const matchTitle = file.originalname.match(regexTitle);
const matchDate = file.originalname.match(regex);

// Initialize title and dateWritten
let title = '';
let dateWritten = '';

// Extract title and date if matches are found
if (matchTitle && matchTitle[1]) {
  title = matchTitle[1];  // Title part before the date
} else {
  title = file.originalname;  // Default to the whole file name if no title is found
}

if (matchDate && matchDate[0]) {
  dateWritten = matchDate[0];  // The date part
} else {
  dateWritten = '0000-00-00';  // Default date if no date is found
}

    // add title and date property and set its value to title
    let row = [
    file.originalname,
    title,
    file.originalname,
    dateWritten,
    todaysDate,
    todaysDate,
    `${1}`,
    fileSize
    ]
    rows.push(row);
  })
  }
  try {
    rows.forEach(row => {
      const sql = 'INSERT INTO file (FileName, Title, FileLocalLocation, DateWritten, DataCreationDate, DataLastEditedDate, RecipientCompanyId, FileSize) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

      db.run (sql, row, (err) => {
        if (err) {
          console.log("error updateing row");
          reject(err);
        }
        console.log("succesfully updated database");
      })
    })
    resolve(rows);
  } catch(error) {
    reject(error);
  }
  })
}

const tempStorage = multer.memoryStorage()
upload = multer({storage: tempStorage})

app.post('/api/upload', upload.array('files', 40), virusCheckMiddleware, async(req, res) => {
    const savedFiles = [];
    const unsavedFiles = [];
   
    console.log("inside upload route");
    const files = req.files
    console.log(files)
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        // the file about to be saved from memory to diskstorage
        const file = req.files[i]
        const savePath = path.join(__dirname, 'files', file.originalname);
        try {
          // we can use   fs.writeFileSync(savePath, file.buffer)
          await fs.promises.writeFile(savePath, file.buffer);
          savedFiles.push(file);
          console.log(`file-${[i]}: ${JSON.stringify(file.originalname)} saved to diskStorage`);
        }catch(error) {
          unsavedFiles.push(file);
          console.log('error encountered while saving file to diskStorage');
        }
      } 
      res.status(200).json({"unsavedFiles": unsavedFiles, "savedFiles": savedFiles, "safeFiles": res.locals.safeFiles.originalname, "unsafeFiles": res.locals.unsafeFiles})
      try {
        const response = await uploadFilesToDB(savedFiles);
      } catch(error) {
        console.log("error Updating DB with uploaded files")
      }
    }
    else {
        console.log('every file is unsafe');
        res.status(400).json({"message": "Files not provided"})
    }
})

app.post('/api/download', (req, res) => {
  // Extract the filename from the request body
  const { fileName } = req.body;

  // Validate fileName
  if (!fileName) {
    return res.status(400).json({ message: "Error: File name not provided" });
  }

  // Construct the file path
  const filePath = path.join(__dirname, 'files', fileName);
  // Log the filename for debugging
  console.log(`About to download file: ${fileName}`);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Send the file as a download
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ message: "Error sending file" });
      }
    });
  } else {
    // File doesn't exist, send a 404 response
    res.status(404).json({ message: "File not in repository, shake your Database" });
  }
});




