// Assuming this file has a .js extension and "type": "module" in package.json

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

export default PORT;