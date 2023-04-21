import express from 'express';
import dotenv from 'dotenv';
import AuthRouter from './routes/AuthRouter.js';
import ProjectRouter from './routes/ProjectRouter.js';
import connectDB from './db/connect.js';
import AuthMiddleware from './middlewares/Auth.js';
import NotFoundMiddleware from './middlewares/NotFound.js';
import ErrorHandlerMiddleware from './middlewares/ErrorHandler.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send({ msg: 'Welcome' });
});

app.use('/api/auth', AuthRouter);
app.use('/api/project', AuthMiddleware, ProjectRouter);

app.use(NotFoundMiddleware);
app.use(ErrorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(3001, () => {
      console.log('Server is running on http://localhost:3001');
    });
  } catch (err) {
    console.log(err);
  }
};

start();
