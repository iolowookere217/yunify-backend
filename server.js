// index.js or app.js
import express from 'express';
import cors from 'cors';
import routes from './route/routes.js';

import bodyParser from 'body-parser';



const app = express();

/* middleware */
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); // For parsing form data
app.use(bodyParser.json());


const port = 8080;

app.use('/', routes); // Mount the routes

try {
    app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
    });
} catch (error) {
    console.log("Cannot connect to the server");
}
