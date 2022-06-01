const express = require("express")
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const { async } = require("@firebase/util");
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


//middleware

app.use(cors())
app.use(express.json())

// data base 




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3jajs.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


async function run() {

    try {
        await client.connect()

        const collection = client.db("welcomeEmail").collection("users");


        app.post('/adduser', async (req, res) => {
            const newUser = req.body;
            console.log(newUser)
            const insertUser = await collection.insertOne(newUser);

            if (insertUser?.insertedId) {
                console.log(insertUser)
            }


        })




    }

    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Welcome Email Server')
})

app.listen(port, () => {
    console.log(`Welcome Email Port Server`, port)
})
