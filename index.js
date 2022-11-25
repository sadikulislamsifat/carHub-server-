const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion , ObjectId} = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


//middle wares
app.use(cors());
app.use(express.json());

const blogItems = require('./blog.json');
const brands = require('./categorys.json');
const carsData = require('./cars.json')



app.get('/brand-categories', (req, res) =>{
    res.send(brands)
});




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.osccaca.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
        const allCarsData = client.db('carsHub').collection('carsCollection');
        const reviewCollection = client.db('carsHub').collection('reviews');

        app.get('/reviews', async(req, res) => {
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = reviewCollection.insertOne(review);
            res.send(result)
        });
        
        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })

    }
    finally{

    }
}
run().catch(console.log)



app.get('/', (req, res) => {
    res.send('resell market server running')
});

app.get('/category/:id', (req, res) => {
    const id = req.params.id;
    if(id === "10"){
        res.send(carsData);
    }
    else{
        const category_cars =carsData.filter(n => n.category_id === id)
        res.send(category_cars);
    }
    
});

app.listen(port, () => {
    console.log(`resell market running on port ${port}`)
});

app.get('/blog', (req, res) => {
    res.send(blogItems)
});