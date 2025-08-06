// scripts/test-vercel-connection.js
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

// Tu URI de MongoDB Atlas
const uri = "mongodb+srv://Admon:aGfVRAQ9dwEwNpSi@escuela.rr7gjjr.mongodb.net/ConAutos_DB?retryWrites=true&w=majority";

async function testConnection() {
  console.log('🔍 Probando conexión con MongoDB Atlas...');
  console.log('📍 URI:', uri.replace(/\/\/.*@/, '//***:***@')); // Ocultar credenciales
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conexión exitosa a MongoDB Atlas');
    
    const db = client.db("ConAutos_DB");
    const collections = await db.listCollections().toArray();
    console.log(`📊 Base de datos: ConAutos_DB`);
    console.log(`📁 Colecciones encontradas: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Colecciones:');
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    }
    
    console.log('\n✅ Tu URI está funcionando correctamente');
    console.log('🚀 Listo para usar en Vercel');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verifica que tu cluster esté activo en MongoDB Atlas');
    console.log('   2. Asegúrate de que la IP 0.0.0.0/0 esté en la whitelist');
    console.log('   3. Verifica que el usuario y contraseña sean correctos');
  } finally {
    await client.close();
  }
}

testConnection(); 