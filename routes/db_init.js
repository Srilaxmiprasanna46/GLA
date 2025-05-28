import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const main_project_dir = path.join(__dirname, '..');
const dbPath = path.join(main_project_dir, 'db', 'data.db');

/** Ensure ./db directory exists */
fs.mkdirSync(path.join(main_project_dir, 'db'), { recursive: true });

/** If database already exists, exit */
if (fs.existsSync(dbPath)) {
  console.log('Database already exists. Skipping initialization.');
  process.exit(0);
}

/** Connect to SQLite database (creates if not exists) */
const db = new sqlite3.Database(dbPath);

/** Schema with constraints and trigger logic */
const schema = `
CREATE TABLE student (
    rollnumber TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE studentlog (
    rollnumber TEXT NOT NULL,
    log DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (rollnumber) REFERENCES student(rollnumber)
);

CREATE UNIQUE INDEX idx_unique_log_per_day
ON studentlog (rollnumber, date(log));

CREATE TRIGGER prevent_duplicate_log
BEFORE INSERT ON studentlog
FOR EACH ROW
WHEN EXISTS (
    SELECT 1 FROM studentlog
    WHERE rollnumber = NEW.rollnumber
    AND date(log) = date('now')
)
BEGIN
    SELECT RAISE(ABORT, 'Log entry already exists for this student today');
END;
`;

/** Execute schema */
db.exec(schema, (err) => {
  if (err) {
    console.error('Failed to initialize database:', err.message);
  } else {
    console.log('Database initialized successfully.');
  }
  db.close();
});
