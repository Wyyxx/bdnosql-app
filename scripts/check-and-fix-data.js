const { MongoClient, ObjectId } = require('mongodb');

async function checkAndFixData() {
  const uri = "mongodb+srv://ricky:ricky123@cluster0.mongodb.net/ConAutos_DB?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const rentasCollection = db.collection('rentas');
    const clientesCollection = db.collection('clientes');
    const autosCollection = db.collection('autos');

    // 1. Verificar datos existentes
    console.log('\n📊 1. VERIFICANDO DATOS EXISTENTES:');
    
    const rentas = await rentasCollection.find({}).toArray();
    const clientes = await clientesCollection.find({}).toArray();
    const autos = await autosCollection.find({}).toArray();

    console.log(`📋 Rentas: ${rentas.length}`);
    console.log(`👥 Clientes: ${clientes.length}`);
    console.log(`🚗 Autos: ${autos.length}`);

    // 2. Si no hay clientes, crear algunos
    if (clientes.length === 0) {
      console.log('\n👥 2. CREANDO CLIENTES DE PRUEBA:');
      
      const clientesPrueba = [
        {
          nombre: "Juan Pérez",
          correo: "juan.perez@email.com",
          telefono: "555-0101",
          direccion: "Calle Principal 123",
          activo: true,
          fecha_registro: new Date()
        },
        {
          nombre: "María García",
          correo: "maria.garcia@email.com",
          telefono: "555-0102",
          direccion: "Avenida Central 456",
          activo: true,
          fecha_registro: new Date()
        },
        {
          nombre: "Carlos Rodríguez",
          correo: "carlos.rodriguez@email.com",
          telefono: "555-0103",
          direccion: "Plaza Mayor 789",
          activo: true,
          fecha_registro: new Date()
        }
      ];

      for (const cliente of clientesPrueba) {
        const resultado = await clientesCollection.insertOne(cliente);
        console.log(`✅ Cliente creado: ${cliente.nombre} (ID: ${resultado.insertedId})`);
      }
    }

    // 3. Si no hay autos, crear algunos
    if (autos.length === 0) {
      console.log('\n🚗 3. CREANDO AUTOS DE PRUEBA:');
      
      const autosPrueba = [
        {
          marca: "Toyota",
          modelo: "Corolla",
          año: 2022,
          placas: "ABC-123",
          disponible: true,
          kilometraje: 15000,
          categoria: "Sedán",
          fecha_ingreso: new Date()
        },
        {
          marca: "Honda",
          modelo: "Civic",
          año: 2023,
          placas: "XYZ-789",
          disponible: true,
          kilometraje: 8000,
          categoria: "Sedán",
          fecha_ingreso: new Date()
        },
        {
          marca: "Nissan",
          modelo: "Sentra",
          año: 2022,
          placas: "DEF-456",
          disponible: true,
          kilometraje: 12000,
          categoria: "Sedán",
          fecha_ingreso: new Date()
        }
      ];

      for (const auto of autosPrueba) {
        const resultado = await autosCollection.insertOne(auto);
        console.log(`✅ Auto creado: ${auto.marca} ${auto.modelo} (ID: ${resultado.insertedId})`);
      }
    }

    // 4. Obtener datos actualizados
    const clientesActualizados = await clientesCollection.find({ activo: true }).toArray();
    const autosDisponibles = await autosCollection.find({ disponible: true }).toArray();

    console.log(`\n👥 Clientes activos: ${clientesActualizados.length}`);
    console.log(`🚗 Autos disponibles: ${autosDisponibles.length}`);

    // 5. Si no hay rentas, crear algunas
    if (rentas.length === 0 && clientesActualizados.length > 0 && autosDisponibles.length > 0) {
      console.log('\n📋 4. CREANDO RENTAS DE PRUEBA:');
      
      const rentasPrueba = [
        {
          cliente_id: clientesActualizados[0]._id.toString(),
          auto_id: autosDisponibles[0]._id.toString(),
          fecha_inicio: new Date('2024-01-15'),
          fecha_fin: new Date('2024-01-20'),
          precio_total: 2500,
          estatus: 'activa'
        },
        {
          cliente_id: clientesActualizados[1] ? clientesActualizados[1]._id.toString() : clientesActualizados[0]._id.toString(),
          auto_id: autosDisponibles[1] ? autosDisponibles[1]._id.toString() : autosDisponibles[0]._id.toString(),
          fecha_inicio: new Date('2024-01-10'),
          fecha_fin: new Date('2024-01-15'),
          precio_total: 3000,
          estatus: 'finalizada'
        },
        {
          cliente_id: clientesActualizados[0]._id.toString(),
          auto_id: autosDisponibles[0]._id.toString(),
          fecha_inicio: new Date('2024-01-05'),
          fecha_fin: new Date('2024-01-12'),
          precio_total: 4200,
          estatus: 'activa'
        }
      ];

      for (const renta of rentasPrueba) {
        const resultado = await rentasCollection.insertOne(renta);
        console.log(`✅ Renta creada con ID: ${resultado.insertedId}`);
      }
    }

    // 6. Verificar que todo funciona
    console.log('\n🔍 5. VERIFICANDO FUNCIONAMIENTO:');
    
    const rentasFinales = await rentasCollection.find({}).toArray();
    console.log(`Total de rentas: ${rentasFinales.length}`);

    for (const renta of rentasFinales.slice(0, 3)) {
      try {
        const clienteId = new ObjectId(renta.cliente_id);
        const autoId = new ObjectId(renta.auto_id);
        
        const cliente = await clientesCollection.findOne({ _id: clienteId });
        const auto = await autosCollection.findOne({ _id: autoId });
        
        console.log(`\nRenta ${renta._id}:`);
        console.log(`  Cliente: ${cliente ? cliente.nombre : 'No encontrado'}`);
        console.log(`  Auto: ${auto ? `${auto.marca} ${auto.modelo}` : 'No encontrado'}`);
        console.log(`  Estatus: ${renta.estatus}`);
      } catch (error) {
        console.log(`❌ Error procesando renta ${renta._id}: ${error.message}`);
      }
    }

    console.log('\n🎉 Verificación y corrección completadas!');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

checkAndFixData(); 