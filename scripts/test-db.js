// scripts/test-db.js
const { MongoClient } = require('mongodb');
const path = require('path');

// Configurar dotenv para buscar .env.local en la raíz del proyecto
require('dotenv').config({ 
  path: path.join(__dirname, '..', '.env.local') 
});

async function testDatabaseConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ Error: No se encontró la variable MONGODB_URI en .env.local');
    console.log('📝 Asegúrate de crear el archivo .env.local en la raíz del proyecto');
    console.log(`📍 Buscando archivo en: ${path.join(__dirname, '..', '.env.local')}`);
    console.log('\n💡 Ejecuta: npm run setup para crear el archivo automáticamente');
    return;
  }

  console.log('🔍 Probando conexión a MongoDB Atlas...');

  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Conexión exitosa a MongoDB Atlas');
    
    // Usar la base de datos "ConAutos_DB" que ya existe
    const db = client.db("ConAutos_DB");
    const collections = await db.listCollections().toArray();
    
    console.log(`📊 Base de datos: ConAutos_DB`);
    console.log(`📁 Colecciones encontradas: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Colecciones:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    } else {
      console.log('📝 No hay colecciones en la base de datos "ConAutos_DB"');
      console.log('💡 Puedes crear colecciones desde MongoDB Atlas o tu aplicación');
    }
    
    // Probar una operación simple
    const stats = await db.stats();
    console.log(`💾 Tamaño de la base de datos: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    
    await client.close();
    console.log('✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica que la URI de MongoDB Atlas sea correcta en .env.local');
    console.log('2. Verifica que las credenciales sean válidas');
    console.log('3. Verifica que tu IP esté en la whitelist de MongoDB Atlas');
    console.log('4. Asegúrate de que el archivo .env.local esté en la raíz del proyecto');
    console.log('5. Si usas MongoDB local, cambia la URI por: mongodb://localhost:27017/ConAutos_DB');
  }
}

testDatabaseConnection(); 