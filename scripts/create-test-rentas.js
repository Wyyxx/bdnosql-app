const { MongoClient, ObjectId } = require('mongodb');

async function createTestRentas() {
  const uri = "mongodb+srv://ricky:ricky123@cluster0.mongodb.net/ConAutos_DB?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const rentasCollection = db.collection('rentas');
    const clientesCollection = db.collection('clientes');
    const autosCollection = db.collection('autos');

    // 1. Obtener clientes y autos disponibles
    console.log('\n📊 1. OBTENIENDO DATOS DISPONIBLES:');
    
    const clientes = await clientesCollection.find({ activo: true }).toArray();
    const autos = await autosCollection.find({ disponible: true }).toArray();

    console.log(`👥 Clientes activos: ${clientes.length}`);
    console.log(`🚗 Autos disponibles: ${autos.length}`);

    if (clientes.length === 0) {
      console.log('❌ No hay clientes activos disponibles');
      return;
    }

    if (autos.length === 0) {
      console.log('❌ No hay autos disponibles');
      return;
    }

    // 2. Limpiar rentas existentes (opcional)
    console.log('\n🧹 2. LIMPIANDO RENTAS EXISTENTES:');
    const deleteResult = await rentasCollection.deleteMany({});
    console.log(`Rentas eliminadas: ${deleteResult.deletedCount}`);

    // 3. Crear rentas de prueba
    console.log('\n🧪 3. CREANDO RENTAS DE PRUEBA:');
    
    const rentasPrueba = [
      {
        cliente_id: clientes[0]._id.toString(),
        auto_id: autos[0]._id.toString(),
        fecha_inicio: new Date('2024-01-15'),
        fecha_fin: new Date('2024-01-20'),
        precio_total: 2500,
        estatus: 'activa'
      },
      {
        cliente_id: clientes[1] ? clientes[1]._id.toString() : clientes[0]._id.toString(),
        auto_id: autos[1] ? autos[1]._id.toString() : autos[0]._id.toString(),
        fecha_inicio: new Date('2024-01-10'),
        fecha_fin: new Date('2024-01-15'),
        precio_total: 3000,
        estatus: 'finalizada'
      },
      {
        cliente_id: clientes[0]._id.toString(),
        auto_id: autos[0]._id.toString(),
        fecha_inicio: new Date('2024-01-05'),
        fecha_fin: new Date('2024-01-12'),
        precio_total: 4200,
        estatus: 'activa'
      }
    ];

    // Insertar rentas
    for (let i = 0; i < rentasPrueba.length; i++) {
      const renta = rentasPrueba[i];
      console.log(`\nCreando renta ${i + 1}:`);
      console.log(`  Cliente: ${clientes.find(c => c._id.toString() === renta.cliente_id)?.nombre}`);
      console.log(`  Auto: ${autos.find(a => a._id.toString() === renta.auto_id)?.marca} ${autos.find(a => a._id.toString() === renta.auto_id)?.modelo}`);
      console.log(`  Fechas: ${renta.fecha_inicio.toISOString().split('T')[0]} - ${renta.fecha_fin.toISOString().split('T')[0]}`);
      console.log(`  Precio: $${renta.precio_total}`);
      console.log(`  Estatus: ${renta.estatus}`);
      
      const resultado = await rentasCollection.insertOne(renta);
      console.log(`  ✅ Renta creada con ID: ${resultado.insertedId}`);
    }

    // 4. Verificar las rentas creadas
    console.log('\n📋 4. VERIFICANDO RENTAS CREADAS:');
    const rentasCreadas = await rentasCollection.find({}).toArray();
    console.log(`Total de rentas: ${rentasCreadas.length}`);

    for (const renta of rentasCreadas) {
      console.log(`\nRenta ID: ${renta._id}`);
      console.log(`  cliente_id: ${renta.cliente_id}`);
      console.log(`  auto_id: ${renta.auto_id}`);
      console.log(`  estatus: ${renta.estatus}`);
    }

    // 5. Probar la API
    console.log('\n🔍 5. PROBANDO CONSULTAS:');
    
    for (const renta of rentasCreadas) {
      try {
        const clienteId = new ObjectId(renta.cliente_id);
        const autoId = new ObjectId(renta.auto_id);
        
        const cliente = await clientesCollection.findOne({ _id: clienteId });
        const auto = await autosCollection.findOne({ _id: autoId });
        
        console.log(`\nRenta ${renta._id}:`);
        console.log(`  Cliente: ${cliente ? cliente.nombre : 'No encontrado'}`);
        console.log(`  Auto: ${auto ? `${auto.marca} ${auto.modelo}` : 'No encontrado'}`);
      } catch (error) {
        console.log(`❌ Error procesando renta ${renta._id}: ${error.message}`);
      }
    }

    console.log('\n🎉 Rentas de prueba creadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la creación:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

createTestRentas(); 