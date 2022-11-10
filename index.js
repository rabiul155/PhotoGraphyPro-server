const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

//midleware
app.use(cors());

app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i4cqwjk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const servicesCollection = client.db('Photografer').collection('services')
        const reviewsCollection = client.db('Photografer').collection('reviews')
        app.get('/home-services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query)
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.send(service)

        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service)
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        })
        app.get('/reviews/:id', async (req, res) => {
            const email = req.params.id;
            const query = { email: email };
            const cursor = reviewsCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })



        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { review_id: id };
            const cursor = reviewsCollection.find(query)
            const reviews = await cursor.toArray();
            res.send(reviews);

        })



    }

    finally {

    }

}
run().catch(error => console.log(error));


app.get('/', (req, res) => {
    res.send('hey buddy I am your server')
})

app.listen(port, () => {
    console.log('server running on port ', port)
})