const { MongoClient, ObjectId } = require('mongodb');

async function testReparacionesAPI() {
  const uri = "mongodb+srv://ricky:ricky123@cluster0.mongodb.net/ConAutos_DB?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const autosCollection = db.collection('autos');
    const reparacionesCollection = db.collection('reparaciones');

    // 1. Verificar autos disponibles
    console.log('\n📋 1. VERIFICANDO AUTOS DISPONIBLES:');
    const autos = await autosCollection.find({}).toArray();
    console.log(`Encontrados ${autos.length} autos:`);
    
    if (autos.length === 0) {
      console.log('❌ No hay autos disponibles. Primero crea algunos autos.');
      return;
    }

    autos.forEach((auto, index) => {
      console.log(`  ${index + 1}. ${auto.marca} ${auto.modelo} (${auto.placas}) - ID: ${auto._id}`);
    });

    // 2. Verificar reparaciones existentes
    console.log('\n🔧 2. VERIFICANDO REPARACIONES EXISTENTES:');
    const reparaciones = await reparacionesCollection.find({}).toArray();
    console.log(`Encontradas ${reparaciones.length} reparaciones`);

    // 3. Crear una reparación de prueba
    console.log('\n🧪 3. CREANDO REPARACIÓN DE PRUEBA:');
    
    const primerAuto = autos[0];
    const reparacionPrueba = {
      auto_id: primerAuto._id.toString(),
      descripcion: "Prueba de reparación",
      costo: 500,
      fecha: new Date().toISOString().split('T')[0],
      taller: "Taller de Prueba"
    };

    console.log('Datos de prueba:', reparacionPrueba);

    // Insertar directamente en MongoDB
    const resultado = await reparacionesCollection.insertOne(reparacionPrueba);
    console.log('✅ Reparación creada directamente en MongoDB con ID:', resultado.insertedId);

    // 4. Verificar que se creó correctamente
    console.log('\n🔍 4. VERIFICANDO REPARACIÓN CREADA:');
    const reparacionCreada = await reparacionesCollection.findOne({ _id: resultado.insertedId });
    console.log('Reparación encontrada:', reparacionCreada);

    // 5. Probar búsqueda por auto_id
    console.log('\n🔍 5. PROBANDO BÚSQUEDA POR AUTO_ID:');
    const reparacionesDelAuto = await reparacionesCollection.find({ 
      auto_id: primerAuto._id.toString() 
    }).toArray();
    console.log(`Reparaciones del auto ${primerAuto.marca} ${primerAuto.modelo}:`, reparacionesDelAuto.length);

    // 6. Limpiar datos de prueba
    console.log('\n🧹 6. LIMPIANDO DATOS DE PRUEBA:');
    const deleteResult = await reparacionesCollection.deleteOne({ _id: resultado.insertedId });
    console.log('Reparación de prueba eliminada:', deleteResult.deletedCount > 0);

    console.log('\n✅ Pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

testReparacionesAPI(); 