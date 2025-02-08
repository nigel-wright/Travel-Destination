const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const openRoutes = require('./routes/open.routes');
const secureRoutes = require('./routes/secure.routes');
const adminRoutes = require('./routes/admin.routes');
const accountRoutes = require('./routes/account.routes'); 

const app = express();
const port = 3005;

// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '..', 'client')));

// Global Variables
const file_path = 'data/europe-destinations.csv';
let destinations = [];

// Function to parse csv data
const csvData = async () => {
    return new Promise((resolve, reject) => {
        let results = [];
        let indexID = 0;

        fs.createReadStream(file_path)
            .pipe(csv({
                mapHeaders: ({ header, index }) => index === 0 ? header.replace(/^\uFEFF/, '') : header, // Remove BOM
            }))
            .on("data", (data) => {
                data.ID = indexID.toString(); // Assign a unique ID (as a string)
                results.push(data);
                indexID += 1; // Increment the counter for the next row
            })
            .on('end', () => {
                destinations = results; 
                resolve(results);
            })
            .on('error', (error) => {
                console.log("There was an error reading the CSV data!")
                reject(error);
            });
    });
};


csvData()
  .then(() => {
    console.log('CSV data loaded successfully.');
    startServer()
  })
  .catch((error) => {
    console.error('Failed to load CSV data:', error);
  });

// Middleware to attach destinations data to request object
app.use((req, res, next) => {
    req.destinations = destinations;
    next();
  });

// Register routes
app.use('/api/open', openRoutes);
app.use('/api/secure', secureRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/account', accountRoutes); 

// For MongoDB connection
const uri = "mongodb+srv://nigeltwright:zti1X0oBJZZ2ggQK@cluster0.rbuko.mongodb.net/lab4?retryWrites=true&w=majority&appName=Cluster0";

function startServer() {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      mongoose.connect(uri)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
    });
  }
