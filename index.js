const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion , ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;


//middle wares
app.use(cors());
app.use(express.json());

const blogItems = require('./blog.json');
const brands = require('./categorys.json');
const carsData = require('./cars.json');
const { query } = require('express');



app.get('/brand-categories', (req, res) =>{
    res.send(brands)
});




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.osccaca.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
        const allCarsData = client.db('carsHub').collection('carsCollection');
        const reviewCollection = client.db('carsHub').collection('reviews');
        const usersCollection = client.db('carsHub').collection('users');

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
        });

        app.get('/allcars', async(req, res) => {
            const query = {};
            const allCars = await allCarsData.find(query).toArray();
            res.send(allCars)
        });
        app.delete('/allcars/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await allCarsData.deleteOne(query);
            res.send(result)
        });
        
        app.get('/cars/:id', (req, res) => {
            const id = req.params.id;
            if(id === "10"){
                res.send(carsData);
            }
            else{
                const category_cars =carsData.filter(n => n.category_id === id)
                res.send(category_cars);
            }
            
        });

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
        });

        app.get('/jwt', async(req, res) => {
            const email = req.query.email;
            const query ={email: email}
            const user = await usersCollection.findOne(query);
            // if(user){
            //     const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '1h'});
            //     return res.send({accesToken: token})
            // }
            const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '1h'});
            //     return res.send({accesToken: token})
            // res.status(403).send({accessToken : ''})
            res.send(token)
           
        });
        app.get('/allSellers', async(req, res) => {
            // const seller = req.params.seller;
            const query = {seller: true};
            const allSeller = await usersCollection.find(query).toArray();
            res.send(allSeller)
        })
        app.get('/allBuyers', async(req, res) => {
            // const seller = req.params.seller;
            const query = {seller: false};
            const allBuyers = await usersCollection.find(query).toArray();
            res.send(allBuyers)
        })

        app.get('/users', async(req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        })

        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)

        });

        app.put('/users/admin/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id) }
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
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

// app.get('/category/:id', (req, res) => {
//     const id = req.params.id;
//     if(id === "10"){
//         res.send(carsData);
//     }
//     else{
//         const category_cars =carsData.filter(n => n.category_id === id)
//         res.send(category_cars);
//     }
    
// });

app.listen(port, () => {
    console.log(`resell market running on port ${port}`)
});

app.get('/blog', (req, res) => {
    res.send(blogItems)
});