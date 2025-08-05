const { MongoClient, ObjectId } = require('mongodb');

async function testRentas() {
  const uri = "mongodb+srv://ricky:ricky123@cluster0.mongodb.net/ConAutos_DB?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const rentasCollection = db.collection('rentas');
    const clientesCollection = db.collection('clientes');
    const autosCollection = db.collection('autos');

    // 1. Verificar datos disponibles
    console.log('\n📊 1. VERIFICANDO DATOS DISPONIBLES:');
    
    const clientes = await clientesCollection.find({ activo: true }).toArray();
    const autosDisponibles = await autosCollection.find({ disponible: true }).toArray();
    const rentas = await rentasCollection.find({}).toArray();

    console.log(`👥 Clientes activos: ${clientes.length}`);
    console.log(`🚗 Autos disponibles: ${autosDisponibles.length}`);
    console.log(`📋 Rentas existentes: ${rentas.length}`);

    if (clientes.length === 0) {
      console.log('❌ No hay clientes activos disponibles');
      return;
    }

    if (autosDisponibles.length === 0) {
      console.log('❌ No hay autos disponibles');
      return;
    }

    // 2. Mostrar clientes disponibles
    console.log('\n👥 2. CLIENTES DISPONIBLES:');
    clientes.forEach((cliente, index) => {
      console.log(`   ${index + 1}. ${cliente.nombre} - ${cliente.correo}`);
    });

    // 3. Mostrar autos disponibles
    console.log('\n🚗 3. AUTOS DISPONIBLES:');
    autosDisponibles.forEach((auto, index) => {
      console.log(`   ${index + 1}. ${auto.marca} ${auto.modelo} (${auto.placas})`);
    });

    // 4. Crear una renta de prueba
    console.log('\n🧪 4. CREANDO RENTA DE PRUEBA:');
    
    const clientePrueba = clientes[0];
    const autoPrueba = autosDisponibles[0];
    
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 5); // 5 días después

    const rentaPrueba = {
      cliente_id: clientePrueba._id.toString(),
      auto_id: autoPrueba._id.toString(),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      precio_total: 2500,
      estatus: 'activa'
    };

    console.log('Datos de prueba:', {
      cliente: clientePrueba.nombre,
      auto: `${autoPrueba.marca} ${autoPrueba.modelo}`,
      fecha_inicio: fechaInicio.toISOString().split('T')[0],
      fecha_fin: fechaFin.toISOString().split('T')[0],
      precio_total: rentaPrueba.precio_total
    });

    // Insertar renta
    const resultado = await rentasCollection.insertOne(rentaPrueba);
    console.log('✅ Renta creada con ID:', resultado.insertedId);

    // 5. Verificar que el auto se marcó como no disponible
    console.log('\n🔍 5. VERIFICANDO DISPONIBILIDAD DEL AUTO:');
    const autoActualizado = await autosCollection.findOne({ _id: autoPrueba._id });
    console.log(`Auto ${autoActualizado.marca} ${autoActualizado.modelo} disponible: ${autoActualizado.disponible}`);

    // 6. Obtener renta con información completa
    console.log('\n📋 6. OBTENIENDO RENTA CON INFORMACIÓN COMPLETA:');
    const rentaCompleta = await rentasCollection.findOne({ _id: resultado.insertedId });
    
    const clienteInfo = await clientesCollection.findOne({ _id: new ObjectId(rentaCompleta.cliente_id) });
    const autoInfo = await autosCollection.findOne({ _id: new ObjectId(rentaCompleta.auto_id) });

    console.log('Renta completa:', {
      id: rentaCompleta._id,
      cliente: clienteInfo.nombre,
      auto: `${autoInfo.marca} ${autoInfo.modelo}`,
      fechas: `${rentaCompleta.fecha_inicio.toISOString().split('T')[0]} - ${rentaCompleta.fecha_fin.toISOString().split('T')[0]}`,
      precio: rentaCompleta.precio_total,
      estatus: rentaCompleta.estatus
    });

    // 7. Actualizar renta
    console.log('\n🔄 7. ACTUALIZANDO RENTA:');
    
    const rentaActualizada = {
      ...rentaCompleta,
      precio_total: 3000,
      estatus: 'finalizada'
    };

    const updateResult = await rentasCollection.updateOne(
      { _id: resultado.insertedId },
      { $set: { precio_total: 3000, estatus: 'finalizada' } }
    );

    console.log('✅ Renta actualizada:', updateResult.modifiedCount > 0);

    // 8. Marcar auto como disponible nuevamente
    console.log('\n🚗 8. MARCANDO AUTO COMO DISPONIBLE:');
    await autosCollection.updateOne(
      { _id: autoPrueba._id },
      { $set: { disponible: true } }
    );
    console.log('✅ Auto marcado como disponible');

    // 9. Limpiar datos de prueba
    console.log('\n🧹 9. LIMPIANDO DATOS DE PRUEBA:');
    const deleteResult = await rentasCollection.deleteOne({ _id: resultado.insertedId });
    console.log('Renta de prueba eliminada:', deleteResult.deletedCount > 0);

    console.log('\n🎉 Pruebas de rentas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

testRentas(); 