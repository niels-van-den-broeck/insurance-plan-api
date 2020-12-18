import express from 'express';

const app = express();
// global middleware
app.use(express.json());

export default app;
