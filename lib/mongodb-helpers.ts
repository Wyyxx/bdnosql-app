// lib/mongodb-helpers.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

if (!uri) throw new Error('Falta la variable MONGODB_URI en .env.local');

const client = new MongoClient(uri);
const clientPromise = client.connect();

export default clientPromise;
