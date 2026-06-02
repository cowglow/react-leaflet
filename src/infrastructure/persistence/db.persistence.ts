import connectToDatabase from "infrastructure/persistence/db.client.ts";

export async function saveData(data: string) {
  const db = await connectToDatabase();
  const collection = db.collection("test_collection");
  const result = await collection.insertOne(data);
  console.log("Data saved:", result);
}