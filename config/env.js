import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5050;
export const DB_URI = process.env.ATLAS_URI || '';
export const FRONT_URL = process.env.FRONT_URL || '';
