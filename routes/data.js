import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const main_project_dir = path.join(__dirname, '..');
const path_of_db = path.join(main_project_dir, 'db', 'data.db');

export default router;
