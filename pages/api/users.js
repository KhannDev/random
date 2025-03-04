// pages/api/users.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", ["POST"]);
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { userId, name } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ error: "Missing userId or name" });
    }

    const client = await clientPromise;
    const db = client.db("myDatabase"); // Replace with your actual DB name
    const collection = db.collection("users");

    // Check if the user ID already exists
    const existingUser = await collection.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ error: "Employee already registered" });
    }

    const result = await collection.insertOne({ userId, name });
    return res.status(200).json({ message: "User added successfully", result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add user" });
  }
}
