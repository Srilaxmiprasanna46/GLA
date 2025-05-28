/*
 * Entry point of the source
 * Please do not write Database logic here
 * Just make sure you route for the main APIs 
 * to avoid confurion
 */


/*
 * Run the db_init.js to initialize the database 
 * Run env_init.js to initialize the .env file
 * To run tests use the test directory and 
 * run the make file
 * 
 * Note that you will need a Linux system or 
 * Shellscript complience to run these tests
 */
import express from 'express';
import dotenv from 'dotenv';
import data from './data';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* Sets up the main project dir path */
const main_project_dir = path.join(__dirname, '..');
dotenv.config(); /* Do create the file */


/* Please set up all the paths here, we don't want path.join again and again */
const path_to_rendered = path.join(main_project_dir, '/rendered');

const app = express();
const port = process.env.PORT; /* Do not hardcode the port here */
app.use(cors());
app.use(express.static(path.join(path_to_rendered)));


/*
 * The main API
 * The student data handling logic 
 */

app.use("/api/logs", data);

app.listen(port, () => {
	console.log(`The app is listening on ${port}`);
});
