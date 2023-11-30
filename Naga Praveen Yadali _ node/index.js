const http = require('http');
const path = require('path')
const fs = require('fs');
const mongodb = require('mongodb');
const server = http.createServer((req, res) => {


    console.log(req.url);



    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });

    }
    
    else if (req.url === '/style.css') { // add this else if statement to serve style.css
        fs.readFile(path.join(__dirname, 'public', 'style.css'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-type': 'text/css' });
            res.end(content);
        });
    }
   
    else if (req.url === "/api") {
        var input;

        //import { MongoClient } from 'mongodb';
        const { MongoClient } = require('mongodb');

        main(processData);
        async function main(callback) {

            const { MongoClient, ServerApiVersion } = require('mongodb');
            const uri = "mongodb+srv://db:db123@cluster0.nad6adk.mongodb.net/?retryWrites=true&w=majority";

            // Create a MongoClient with a MongoClientOptions object to set the Stable API version
            const client = new MongoClient(uri, { useUnifiedTopology: true });
            try {
                //Import the MongoClient class from the mongodb package:


                // Connect to MongoDB Atlas cluster
                await client.connect();
                console.log('Connected to MongoDB Atlas cluster');

                const CarCollections = client.db('Cars').collection('Models');

                const collectionData = {

                    CarDetails: await CarCollections.find().toArray()
                };

                console.log(collectionData);


                input = collectionData;
                console.log('My data from Mongo Db');
                console.log(input);



                callback(input);

            } catch (err) {
                console.error(err);
            } finally {

                await client.close();
                console.log('Disconnected from MongoDB Atlas cluster');
            }

        }

        function processData(data) {

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { 'Content-type': 'application/json' });
            console.log(data);
            res.end(JSON.stringify(data, null, 2));

        }



    }


    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write("<h1>404 not found</h1>")

    }


})


const PORT= process.env.PORT || 3034;

server.listen(PORT,()=> console.log(`Great our server is running on port ${PORT} `));