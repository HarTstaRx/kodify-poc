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

const commands = ['message', 'start-typing', 'stop-typing', 'nick', 'delete-last', 'fade-last', 'countdown'];
for (const command of commands) {
  router.post(`/${command}`, (request, response) => {
    channel.publish(request.body, command);
    response.sendStatus(200);
  })
}

router.get('/messages', (request, response) => {
  return channel.subscribe(request, response);
});

app.use('/', router);

app.listen(2023, () => {
  console.log('Server listening on', 2023);
});
