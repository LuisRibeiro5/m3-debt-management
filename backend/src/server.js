import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(3002, () => {
  console.log('Server is running on http://localhost:3002');
});