import express from 'express';
import SSEChannel from 'sse-pubsub';
import bodyParser from 'body-parser';

const router = express.Router();
const app = express();
const channel = new SSEChannel();

app.use(bodyParser.json());
app.use((_request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', '*');
  next();
});
router.post('/chat', (request, response) => {
  channel.publish(request.body, 'message');
  response.sendStatus(200);
});

router.post('/start-typing', (request, response) => {
  channel.publish(request.body, 'start-typing');
  response.sendStatus(200);
});

router.post('/stop-typing', (request, response) => {
  channel.publish(request.body, 'stop-typing');
  response.sendStatus(200);
});

router.post('/nick', (request, response) => {
  channel.publish(request.body, 'nick');
  response.sendStatus(200);
});

router.post('/oops', (request, response) => {
  channel.publish(request.body, 'delete-last');
  response.sendStatus(200);
});

router.get('/messages', (request, response) => {
  return channel.subscribe(request, response);
});

app.use('/', router);

app.listen(2023, () => {
  console.log('Server listening on', 2023);
});
