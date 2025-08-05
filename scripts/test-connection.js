require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ Error: Falta la variable MONGODB_URI en .env.local');
    console.log('💡 Asegúrate de tener un archivo .env.local con MONGODB_URI');
    return;
  }

  console.log('🔗 Intentando conectar a MongoDB...');
  console.log('📝 URI:', uri.substring(0, 20) + '...');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conexión exitosa a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const collections = await db.listCollections().toArray();
    
    console.log(`📊 Base de datos: ConAutos_DB`);
    console.log(`📁 Colecciones encontradas: ${collections.length}`);
    
    for (const collection of collections) {
      console.log(`  - ${collection.name}`);
    }

    // Verificar las colecciones principales
    const rentasCollection = db.collection('rentas');
    const clientesCollection = db.collection('clientes');
    const autosCollection = db.collection('autos');

    const rentasCount = await rentasCollection.countDocuments();
    const clientesCount = await clientesCollection.countDocuments();
    const autosCount = await autosCollection.countDocuments();

    console.log('\n📊 ESTADO ACTUAL DE LA BASE DE DATOS:');
    console.log(`📋 Rentas: ${rentasCount}`);
    console.log(`👥 Clientes: ${clientesCount}`);
    console.log(`🚗 Autos: ${autosCount}`);

    console.log('\n🎉 Conexión y verificación completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('1. Verifica que tu archivo .env.local tenga MONGODB_URI');
    console.log('2. Verifica que la URI de MongoDB Atlas sea correcta');
    console.log('3. Verifica tu conexión a internet');
    console.log('4. Verifica que tu IP esté en la lista blanca de MongoDB Atlas');
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

testConnection(); 