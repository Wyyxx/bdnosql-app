const { MongoClient } = require('mongodb');

async function createReparaciones() {
  const uri = "mongodb+srv://ricky:ricky123@cluster0.mongodb.net/ConAutos_DB?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const autosCollection = db.collection('autos');
    const reparacionesCollection = db.collection('reparaciones');

    // 1. Obtener todos los autos disponibles
    console.log('\n📋 1. Obteniendo autos disponibles...');
    const autos = await autosCollection.find({}).toArray();
    console.log(`Encontrados ${autos.length} autos:`);
    autos.forEach(auto => {
      console.log(`  - ${auto.marca} ${auto.modelo} (${auto.placas}) - ID: ${auto._id}`);
    });

    if (autos.length === 0) {
      console.log('❌ No hay autos disponibles para asignar reparaciones');
      return;
    }

    // 2. Limpiar reparaciones existentes (opcional)
    console.log('\n🗑️ 2. Limpiando reparaciones existentes...');
    const deleteResult = await reparacionesCollection.deleteMany({});
    console.log(`Eliminadas ${deleteResult.deletedCount} reparaciones existentes`);

    // 3. Crear reparaciones asignadas a autos específicos
    console.log('\n🔧 3. Creando reparaciones...');

    const reparaciones = [
      {
        auto_id: autos[0]._id.toString(),
        descripcion: "Cambio de aceite y filtros",
        costo: 850,
        fecha: new Date("2024-01-15"),
        taller: "Taller Central"
      },
      {
        auto_id: autos[0]._id.toString(),
        descripcion: "Reparación de frenos",
        costo: 1200,
        fecha: new Date("2024-02-20"),
        taller: "Frenos Express"
      },
      {
        auto_id: autos[0]._id.toString(),
        descripcion: "Alineación y balanceo",
        costo: 450,
        fecha: new Date("2024-03-10"),
        taller: "Servicio Rápido"
      }
    ];

    // Si hay más de un auto, crear reparaciones para el segundo auto
    if (autos.length > 1) {
      reparaciones.push(
        {
          auto_id: autos[1]._id.toString(),
          descripcion: "Reparación de aire acondicionado",
          costo: 2100,
          fecha: new Date("2024-01-25"),
          taller: "Climas del Norte"
        },
        {
          auto_id: autos[1]._id.toString(),
          descripcion: "Cambio de llantas",
          costo: 1800,
          fecha: new Date("2024-02-15"),
          taller: "Llantas Plus"
        }
      );
    }

    // Si hay más de dos autos, crear reparaciones para el tercer auto
    if (autos.length > 2) {
      reparaciones.push(
        {
          auto_id: autos[2]._id.toString(),
          descripcion: "Reparación de transmisión",
          costo: 3500,
          fecha: new Date("2024-01-30"),
          taller: "Transmisiones Especializadas"
        },
        {
          auto_id: autos[2]._id.toString(),
          descripcion: "Cambio de batería",
          costo: 650,
          fecha: new Date("2024-03-05"),
          taller: "Baterías Express"
        }
      );
    }

    // 4. Insertar las reparaciones
    console.log('\n💾 4. Insertando reparaciones...');
    for (const reparacion of reparaciones) {
      const resultado = await reparacionesCollection.insertOne(reparacion);
      console.log(`✅ Reparación creada: ${reparacion.descripcion} - Auto ID: ${reparacion.auto_id}`);
    }

    // 5. Verificar las reparaciones creadas
    console.log('\n🔍 5. Verificando reparaciones creadas...');
    const reparacionesCreadas = await reparacionesCollection.find({}).toArray();
    console.log(`Total de reparaciones creadas: ${reparacionesCreadas.length}`);

    reparacionesCreadas.forEach(reparacion => {
      const auto = autos.find(a => a._id.toString() === reparacion.auto_id);
      const autoInfo = auto ? `${auto.marca} ${auto.modelo} (${auto.placas})` : 'Auto no encontrado';
      console.log(`  - ${reparacion.descripcion} | ${autoInfo} | $${reparacion.costo} | ${reparacion.taller}`);
    });

    console.log('\n🎉 Reparaciones creadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la creación:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

createReparaciones(); 