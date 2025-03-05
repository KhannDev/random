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

    const employeesCollection = db.collection("employees");
    const usersCollection = db.collection("users");

    // Check if userId exists in employees collection
    const isEmployee = await employeesCollection.findOne({ userId });
    console.log(isEmployee);
    if (!isEmployee) {
      return res.status(400).json({ error: "Incorrect Employee ID" });
    }

    // Check if the user ID already exists in users collection
    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ error: "Employee already registered" });
    }

    // Insert the new user into users collection
    const result = await usersCollection.insertOne({
      userId,
      name: isEmployee.name,
    });
    return res.status(200).json({ message: "Successfully Registered", result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add user" });
  }
}
