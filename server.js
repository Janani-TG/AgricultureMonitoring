const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGODB_URI);

let readingsCollection;


// Middleware
app.use(express.json());

app.use(express.static("public"));


// Connect to MongoDB and start server
async function startServer() {

    try {

        await client.connect();

        console.log("Connected to MongoDB Atlas");


        const database =
            client.db("agricultureDB");


        readingsCollection =
            database.collection("sensorReadings");


        app.listen(PORT, () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "Database connection failed:",
            error
        );

    }

}



// CREATE
app.post("/api/readings", async (req, res) => {

    try {

        const reading = {

            greenhouse: req.body.greenhouse,

            soilMoisture:
                Number(req.body.soilMoisture),

            temperature:
                Number(req.body.temperature),

            humidity:
                Number(req.body.humidity),

            recordedAt: new Date()

        };


        const result =
            await readingsCollection.insertOne(reading);


        res.json({

            message: "Reading added successfully",

            id: result.insertedId

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            error: "Failed to add reading"

        });

    }

});



// READ
app.get("/api/readings", async (req, res) => {

    try {

        const readings =
            await readingsCollection
                .find()
                .sort({ recordedAt: -1 })
                .toArray();


        res.json(readings);


    } catch (error) {

        console.error(error);

        res.status(500).json({

            error: "Failed to fetch readings"

        });

    }

});



// UPDATE
app.put("/api/readings/:id", async (req, res) => {

    try {

        const id = req.params.id;


        await readingsCollection.updateOne(

            {
                _id: new ObjectId(id)
            },

            {
                $set: {

                    greenhouse:
                        req.body.greenhouse,

                    soilMoisture:
                        Number(req.body.soilMoisture),

                    temperature:
                        Number(req.body.temperature),

                    humidity:
                        Number(req.body.humidity)

                }
            }

        );


        res.json({

            message: "Reading updated successfully"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            error: "Failed to update reading"

        });

    }

});



// DELETE
app.delete("/api/readings/:id", async (req, res) => {

    try {

        const id = req.params.id;


        await readingsCollection.deleteOne({

            _id: new ObjectId(id)

        });


        res.json({

            message: "Reading deleted successfully"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            error: "Failed to delete reading"

        });

    }

});



// Start application
startServer();