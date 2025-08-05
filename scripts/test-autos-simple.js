const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = "mongodb+srv://ricky:ricky123@cluster0.mongodb.net/ConAutos_DB?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Intentando conectar a MongoDB...');
    await client.connect();
    console.log('✅ Conectado exitosamente a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const autosCollection = db.collection('autos');

    console.log('📋 Contando documentos en colección autos...');
    const count = await autosCollection.countDocuments();
    console.log(`📊 Total de autos en la base de datos: ${count}`);

    if (count > 0) {
      console.log('🔍 Mostrando algunos autos:');
      const autos = await autosCollection.find({}).limit(3).toArray();
      autos.forEach((auto, index) => {
        console.log(`  ${index + 1}. ${auto.marca} ${auto.modelo} - ${auto.placas}`);
      });
    } else {
      console.log('📝 No hay autos en la base de datos');
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

testConnection(); 