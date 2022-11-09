const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hey buddy I am your server')
})

app.listen(port, () => {
    console.log('server running on port ', port)
})