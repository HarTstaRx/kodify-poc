import express from 'express';

const router = express.Router();
const app = express();

app.use((_request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', '*');
  next();
});
router.post('/chat', (request, response) => {
  // TODO
  response.sendStatus(200);
});

router.get('/messages', (request, response) => {
  // TODO
  response.sendStatus(200);
});

app.use('/', router);

app.listen(2023, () => {
  console.log('Server listening on', 2023);
});
