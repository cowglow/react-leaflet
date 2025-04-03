// saveData.js
import connectToDatabase from "./client.ts";

// const connectToDatabase = require('./db');

export async function saveData(data: string) {
  const db = await connectToDatabase();
  const collection = db.collection("test_collection");
  const result = await collection.insertOne(data);
  console.log("Data saved:", result);
}

// Example usage
// const data = { key: 'value' };
// saveData(data).catch(console.error);