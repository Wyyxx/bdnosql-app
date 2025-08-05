// lib/mongodb-helpers.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  console.error('❌ Error: Falta la variable MONGODB_URI en .env.local');
  throw new Error('Falta la variable MONGODB_URI en .env.local');
}

const client = new MongoClient(uri);

// Función para verificar la conexión
export async function testConnection() {
  try {
    const testClient = await client.connect();
    console.log('✅ Conexión exitosa a MongoDB');
    
    // Verificar que podemos acceder a la base de datos
    const db = testClient.db("ConAutos_DB");
    const collections = await db.listCollections().toArray();
    console.log(`📊 Base de datos: ConAutos_DB`);
    console.log(`📁 Colecciones encontradas: ${collections.length}`);
    
    return { success: true, collections: collections.length };
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error instanceof Error ? error.message : 'Error desconocido');
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

const clientPromise = client.connect();

// Función para conectar a la base de datos
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db("ConAutos_DB");
    return { client, db };
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    throw new Error('Error de conexión a la base de datos');
  }
}

export default clientPromise;
