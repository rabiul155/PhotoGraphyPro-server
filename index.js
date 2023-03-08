const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
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
        const bookingCollection = client.db('Photografer').collection('booking')

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

        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.findOne(query);
            res.send(result);
        })


        //for my review 

        app.get('/reviews/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = reviewsCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })

        // for add review 

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })


        // for get review by id 

        app.get('/reviews', async (req, res) => {
            console.log(req.query.review_id);
            const query = { review_id: req.query.review_id };
            const cursor = reviewsCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);

        })



        // delete review 

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })

        // update 

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log(req.body.reviewUpdate)
            const message = req.body.reviewUpdate
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    review: message
                }
            }
            const result = await reviewsCollection.updateOne(filter, updatedDoc, options)

            res.send(result)
        })

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        app.get('/myBooking', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { consumerEmail: email }
            const result = await bookingCollection.find(query).toArray()
            res.send(result);
        })

        app.get('/customerOrder', async (req, res) => {
            const query = {}
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
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