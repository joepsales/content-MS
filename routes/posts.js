const express = require('express');
const Post = require('../models/Post');
const FbPost = require('../models/FbPost');
const amqp = require('amqplib/callback_api');
const axios = require('axios');

require('dotenv').config({ path: require('find-config')('.env') })
const router = express.Router();

const token = process.env.ACCESS_TOKEN;
const pageId = process.env.PAGE_ID;

// Message Broker
amqp.connect('amqps://lzvlbhtr:6cvrOb5ZwKBJ1bJJJ3OOMKESR0Jhoyd8@chinook.rmq.cloudamqp.com/lzvlbhtr', (error0, connection) => {
    if (error0) {
        throw error0
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1
        }

        channel.assertQueue('post_created', { durable: false });
        channel.assertQueue('post_updated', { durable: false });
        channel.assertQueue('post_deleted', { durable: false });

        // Main Endpoint
        router.get('/', (req, res) => {
            res.send('This is the default endpoint for Content-MS.');
        });

        // channel.consume('post_created', async (msg) => {
        //     const eventPost = JSON.parse(msg.content.toString())
        //     const post = new Post();
        //     post.title = eventPost.title;
        //     post.location = eventPost.location;
        //     await post.save();
        //     console.log('Post created')
        // }, { noAck: true })
        
        channel.consume('post_created', async (msg) => {
            const eventPost = JSON.parse(msg.content.toString())
            const post = new FbPost();
            post.content = eventPost.content;
            await axios.post(`https://graph.facebook.com/${pageId}/feed?message=${post.content}&access_token=${token}`, null)
            // post.save(); 
            console.log('Post created')
        }, { noAck: true })

        channel.consume('post_deleted', async (msg) => {
            const post_id = msg.content.toString();
            await Post.deleteOne({post_id})
            console.log(`Post with id ${post_id} deleted.`);
        })
    })
})

process.on('beforeExit', () => {
    consolog.log('closing RabbitMQ connection.');
    connection.close();
})


module.exports = router;