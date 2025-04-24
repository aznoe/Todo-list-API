require("dotenv").config();
const express = require("express");
// const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();

// const uri = process.env.MONGO_URI;

// // Create a single persistent MongoClient instance
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// // Connect to MongoDB when starting the app
// let db;
// async function connectDB() {
//   try {
//     await client.connect();
//     db = client.db("sample_mflix"); // Use your database name
//     console.log("Successfully connected to MongoDB!");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     process.exit(1); // Exit if can't connect
//   }
// };

// // Basic route to test connection
// app.get("/", async (req, res) => {
//   try {
//     // Test the connection by pinging the database
//     await db.command({ ping: 1 });
    
//     res.send("Successfully connected to MongoDB!");
//   } catch (err) {
//     console.error("Database error:", err);
//     res.status(500).send("Database connection error");
//   }
// });

// // Add this route to your existing server
// app.get("/users", async (req, res) => {
//   try {
//     // Access the "users" collection
//     const usersCollection = db.collection("users");
    
//     // Get first 10 users (prevents overload)
//     const users = await usersCollection.find().limit(10).toArray();
    
//     // Return as JSON
//     res.json(users);
//   } catch (err) {
//     console.error("Failed to fetch users:", err);
//     res.status(500).json({ error: "Database error" });
//   }
// });



// Connect to DB and start server
const PORT = process.env.PORT || 3000;
// connectDB().then(() => {
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// });

// // Close connection when app terminates
// process.on('SIGINT', async () => {
//   await client.close();
//   console.log('MongoDB connection closed');
//   process.exit(0);
// });