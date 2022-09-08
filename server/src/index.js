import express from 'express';

const router = express.Router();
const app = express();

router.post('/chat', (request, response) => {
  // TODO
  response.sendStatus(200);
});

router.get('/messages', (request, response) => {
  // TODO
  response.sendStatus(200);
});

app.use('/api', router);

app.listen(2023, () => {
  console.log('Server listening on', 2023);
});
