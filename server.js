

import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from 'dotenv';
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';


// const bodyParser = require('body-parser');
dotenv.config();
// sqlite3 database configuration
// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const myDatabase = path.join(__dirname, 'files.db');
const db = new sqlite3.Database(myDatabase, sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
});

const router = express.Router();
// Other ES module imports
// require('dotenv').config();
const password = process.env.VITE_PASSWORD;
const email = process.env.VITE_EMAIL;
// server used to send send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("tom-letter-app Server is Running"));

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

// END EMAIL SENDING CODE
// SAMPLE TEST JSON DATA
  const user = [
    {id: 1, name: "lema"},
    {id: 2, name: "mohammed"},
    {id: 3, name: "fatima"},
    {id: 4, name: "samir"},
    {id: 5, name: "nina"},
    {id: 6, name: "khalid"},
    {id: 7, name: "layla"},
    {id: 8, name: "yusuf"},
    {id: 9, name: "ahmed"},
    {id: 10, name: "zara"},
    {id: 11, name: "amina"},
    {id: 12, name: "omar"},
    {id: 13, name: "sara"},
    {id: 14, name: "raheem"},
    {id: 15, name: "lila"},
    {id: 16, name: "tariq"},
    {id: 17, name: "salma"},
    {id: 18, name: "hamza"},
    {id: 19, name: "nour"},
    {id: 20, name: "hassan"},
    {id: 21, name: "dalia"},
    {id: 22, name: "farid"},
    {id: 23, name: "ranya"},
    {id: 24, name: "zain"},
    {id: 25, name: "amira"}
  ];
  const post = [
    {id: 1, name: "abebe"},
    {id: 2, name: "kebede"},
    {id: 3, name: "alem"},
    {id: 4, name: "birhanu"},
    {id: 5, name: "meseret"},
    {id: 6, name: "mekonnen"},
    {id: 7, name: "selam"},
    {id: 8, name: "tewodros"},
    {id: 9, name: "amanuel"},
    {id: 10, name: "seble"},
    {id: 11, name: "alemayehu"},
    {id: 12, name: "mulu"},
    {id: 13, name: "tirunesh"},
    {id: 14, name: "dera"},
    {id: 15, name: "sahle"},
    {id: 16, name: "ayele"},
    {id: 17, name: "fikre"},
    {id: 18, name: "mariam"},
    {id: 19, name: "temesgen"},
    {id: 20, name: "genet"},
    {id: 21, name: "hailu"},
    {id: 22, name: "negus"},
    {id: 23, name: "hanna"},
    {id: 24, name: "yohannes"},
    {id: 25, name: "muluwork"}
];
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

// PAGINATION MIDDLEWARE
function paginateResults(model, modelSelect, modelQuery) {
  // This is the middleware function that Express expects
  return async (req, res, next) => {
    try {
      const totalRows = await countRows(modelQuery);
      const totalPages = Math.ceil(totalRows / 10);  // Example with limit set to 10

      const page = parseInt(req.query.page) || 1;  // Default page is 1 if not provided
      const limit = parseInt(req.query.limit) || 10;  // Default limit is 10 if not provided
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const additionalInfo = {};

      if (page > 1) {
        additionalInfo.previousPage = page - 1;
      }
      if (page < totalPages) {
        additionalInfo.nextPage = page + 1;
      }

      db.all(modelSelect, [startIndex, limit], (err, rows) => {
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


  app.get("/", paginateResults(File, FilesSelect, FileQuery), (req, res) => {
    res.json(res.paginateResults)
  })
  
router.get ("/files", paginateDB(File, FilesSelect),(req, res) => {
  res.json(res.paginateDB);
})
function paginateDB(model, modelSelect) {
  return (req, res, next) => {
    const page = parseInt(req.query.page) || 1;   // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10
    let totalModel = 0;
    let totalPages = 0;
    let result = {};
    let additionalInfo = {};

    // First query to get total number of rows in the table
    db.all(model, [], (err, rows) => {
      if (err) {
        console.log("Error fetching total rows:", err);
        return res.status(500).json({ error: err.message });
      }

      totalModel = rows[0].count;
      totalPages = Math.ceil(totalModel / limit);

      if (page > 1) {
        additionalInfo.previousPage = page - 1;
      }
      if (page < totalPages) {
        additionalInfo.nextPage = page + 1;
      }
      additionalInfo.totalModel = totalModel;
      additionalInfo.totalPages = totalPages;
      additionalInfo.limit = limit;

      const startIndex = (page - 1) * limit + 1; // Adjust the start index
      const endIndex = page * limit;

      // Second query to fetch the paginated data
      db.all(modelSelect, [startIndex, endIndex], (err, rows) => {
        if (err) {
          console.log("Error while fetching paginated results:", err);
          return res.status(500).json({ error: err.message });
        }
        result.results = rows;
        result.additionalInfo = additionalInfo;

        // Attach the results to res and move to the next middleware
        // res.paginateDB = result;
        console.log(result);
        res.paginateDB.results = rows;
        res.paginateDB.additionalInfo = additionalInfo;
        next();
      });
    });
  };
}

  router.get("/user", paginateResults(user), (req, res) => {
    res.json(res.paginateResults)
  });

  router.get("/post", paginateResults(post), (req, res) => {
    res.json(res.paginateResults)
  })

  // PAGINATION MIDDLEWARE
  // function paginateResults(model) {

  //   return (req, res, next) => {
  //     const page = parseInt(req.query.page) || 1;  // Default page is 1 if not provided or invalid
  //   const originallimit = parseInt(req.query.limit);  // Parse limit from the query
  //   // Check if limit is valid, else fallback to 10
  //   const limit = isNaN(originallimit) ? 10 : originallimit;
    
  //   const startIndex = (page - 1) * limit;
  //   const endIndex = page * limit;
  
  //   // Slicing the model array
  //   const newUser = model.slice(startIndex, endIndex);
  
  //   // Optional: include total count for better pagination
  //   const totalModel = model.length;
  //   const totalPages = Math.ceil(totalModel/ limit)
        
  //   const result = {};
  //   result.result = newUser;
  //   result.totalModel = totalModel;
  //   result.totalPages = totalPages;
  //   result.limit = limit;
    
  //   if (page - 1 > 0) {
  //       result.previousPage = page - 1
  //   }
  //   if (page < totalPages) {
  //     result.nextPage = page + 1
  //   }
  //   res.paginateResults = result
  //   next()
  //   }

  // }
  // app.get("/", paginateResults(post), (req, res) => {
  //   res.json(res.paginateResults)
  // })