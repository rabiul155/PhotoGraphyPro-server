const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
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