const express = require("express")
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const nodemailer = require("nodemailer");
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



async function sendEmail(newUser, welcomeTemplete) {


    // console.log(newUser, welcomeTemplete)


    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });



    let info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: newUser.email,
        subject: welcomeTemplete.subject,
        text: `${welcomeTemplete.text}`,
        html: `<body>Dear ${newUser.name} ${welcomeTemplete.message} <br/> Have a nice day, <br/> ${welcomeTemplete.senderName}</body>`,
    });
    console.log("Message sent: %s", info.messageId);

}














async function run() {

    try {
        await client.connect()

        const userCollection = client.db("welcomeEmail").collection("users");
        const emailTempletesCollection = client.db("welcomeEmail").collection("emailTempletes");


        app.post('/adduser', async (req, res) => {
            const newUser = req.body;

            const insertUser = await userCollection.insertOne(newUser);

            if (insertUser?.insertedId) {

                const query = { templeteId: "welcomeEmail" }

                const welcomeTemplete = await emailTempletesCollection.findOne(query);

                if (welcomeTemplete.templeteId === "welcomeEmail") {
                    console.log(welcomeTemplete)

                    sendEmail(newUser, welcomeTemplete)

                }

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
