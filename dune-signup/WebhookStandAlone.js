import express from 'express';
import { webhookRouter } from './webhookServer.js';
import { config } from './config.js';

const app = express();
app.use(webhookRouter);
app.get('/', (req, res) => res.send('Dune webhook listener is running.'));
app.listen(config.port, () => {
  console.log(`Dune webhook listener on port ${config.port} — POST GitHub events to /webhook`);
});