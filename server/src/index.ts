import express, { Request, Response } from 'express';
import connectDB from './db/dbConfig.js';
import dotenv from 'dotenv';
import routes from './routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use('/api/v1', routes);


app.listen(3000, () => console.log('listening on port 3000'));
