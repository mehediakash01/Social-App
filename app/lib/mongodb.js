import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI in .env.local");
}

if (process.env.NODE_ENV === "development") {
  // reuse connection for speed
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options).connect();
  }
  clientPromise = global._mongoClient;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
