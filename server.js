const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

const PORT = 3002;

amqp.connect('amqps://lzvlbhtr:6cvrOb5ZwKBJ1bJJJ3OOMKESR0Jhoyd8@chinook.rmq.cloudamqp.com/lzvlbhtr', (error0, connection) => {
    if (error0) {
        throw error0
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1
        }

        channel.assertQueue('hello', { durable: false });



        app.use(bodyParser.json());

        // Main Endpoint
        app.get('/', (req, res) => {
            res.send('This is the default endpoint for Content-MS.');
        });

        channel.consume('hello', (msg) => {
            console.log(msg.content.toString());
        })

        app.listen(PORT, () => {
            console.log(`Service running on ${PORT}.`);
        })
    })
})

