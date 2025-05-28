import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');

/** Check if .env file exists */
if (fs.existsSync(envPath)) {
  console.log('.env already exists. No changes made.');
  process.exit(0);
}

/** Setup readline interface to ask for port number */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/** Ask user for port and write it to .env */
rl.question('Enter the PORT number: ', (port) => {
  const content = `PORT=${port}\n`;
  fs.writeFileSync(envPath, content);
  console.log(`.env file created with PORT=${port}`);
  rl.close();
});
