const cors = require('cors')
const express = require('express')
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [
	  "my-kafka-0.my-kafka-headless.v2-ivanavila1224.svc.cluster.local:9092"
	  ]
});

const producer = kafka.producer()

const app = express();
app.use(cors());
app.options('*', cors());

const port = 8080;

app.get('/', (req, res, next) => {
  res.send('kafka api - adsoft');
});

//ESTE ES EL DE COMENTARIOS
const runComments = async (userid, objectid, message) => {

  await producer.connect()
//    await producer.send()
  await producer.send({
    topic: 'comment',
    messages: [
      {
        'value': `{"userid": "${userid}","objectid": "${objectid}","message": "${message}" }` 
      }
    ],
  })
  await producer.disconnect()
}

app.get('/comments', (req, res, next) => {
const userid = req.query.userid;
const objectid = req.query.objectid;
const message = req.query.message;
res.send({ 'userid':userid, 'objectid': objectid, 'message': message });
runComments(userid, objectid, message).catch(e => console.error(`[example/producer] ${e.message}`, e))

});

app.get('/like', (req, res, next) => {
  const username = req.query.name;
  res.send({ 'name' : username } );
  run(username).catch(e => console.error(`[example/producer] ${e.message}`, e))

});

app.listen(port,  () => 
	console.log('listening on port ' + port
));
