const { MongoClient } = require('mongodb');

async function testAutosAPI() {
  const uri = "mongodb+srv://ricky:ricky123@cluster0.mongodb.net/ConAutos_DB?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const autosCollection = db.collection('autos');

    // 1. Listar autos existentes
    console.log('\n📋 1. Listando autos existentes...');
    const autosExistentes = await autosCollection.find({}).toArray();
    console.log(`Encontrados ${autosExistentes.length} autos:`);
    autosExistentes.forEach(auto => {
      console.log(`  - ${auto.marca} ${auto.modelo} (${auto.placas}) - ${auto.disponible ? 'Disponible' : 'No disponible'}`);
    });

    // 2. Crear un nuevo auto de prueba
    console.log('\n🚗 2. Creando auto de prueba...');
    const nuevoAuto = {
      marca: "Toyota",
      modelo: "Corolla",
      año: 2023,
      placas: "ABC123",
      disponible: true,
      kilometraje: 15000,
      categoria: "Sedán",
      fecha_ingreso: new Date()
    };

    const resultadoCreacion = await autosCollection.insertOne(nuevoAuto);
    console.log(`✅ Auto creado con ID: ${resultadoCreacion.insertedId}`);

    // 3. Buscar el auto creado
    console.log('\n🔍 3. Buscando auto creado...');
    const autoCreado = await autosCollection.findOne({ _id: resultadoCreacion.insertedId });
    console.log('Auto encontrado:', autoCreado);

    // 4. Actualizar el auto
    console.log('\n✏️ 4. Actualizando auto...');
    const resultadoActualizacion = await autosCollection.updateOne(
      { _id: resultadoCreacion.insertedId },
      { 
        $set: { 
          kilometraje: 16000,
          disponible: false
        } 
      }
    );
    console.log(`✅ Auto actualizado: ${resultadoActualizacion.modifiedCount} documento modificado`);

    // 5. Verificar la actualización
    console.log('\n🔍 5. Verificando actualización...');
    const autoActualizado = await autosCollection.findOne({ _id: resultadoCreacion.insertedId });
    console.log('Auto después de actualización:', autoActualizado);

    // 6. Eliminar el auto de prueba
    console.log('\n🗑️ 6. Eliminando auto de prueba...');
    const resultadoEliminacion = await autosCollection.deleteOne({ _id: resultadoCreacion.insertedId });
    console.log(`✅ Auto eliminado: ${resultadoEliminacion.deletedCount} documento eliminado`);

    // 7. Verificar eliminación
    console.log('\n🔍 7. Verificando eliminación...');
    const autoEliminado = await autosCollection.findOne({ _id: resultadoCreacion.insertedId });
    console.log('Auto después de eliminación:', autoEliminado ? '❌ Aún existe' : '✅ Eliminado correctamente');

    console.log('\n🎉 Pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

testAutosAPI(); 