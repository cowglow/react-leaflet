// db.js
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");

let db;

export default async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db("APP_DB");
  }
  return db;
}
