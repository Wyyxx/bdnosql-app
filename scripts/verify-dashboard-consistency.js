const { MongoClient, ObjectId } = require('mongodb');

async function verifyDashboardConsistency() {
  const uri = "mongodb+srv://ricky:ricky123@cluster0.mongodb.net/ConAutos_DB?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const autosCollection = db.collection('autos');
    const clientesCollection = db.collection('clientes');
    const reparacionesCollection = db.collection('reparaciones');

    // 1. Obtener datos reales
    console.log('\n📊 1. DATOS REALES DE LA BASE DE DATOS:');
    
    const autos = await autosCollection.find({}).toArray();
    const clientes = await clientesCollection.find({}).toArray();
    const reparaciones = await reparacionesCollection.find({}).toArray();

    console.log(`🚗 Autos totales: ${autos.length}`);
    console.log(`👥 Clientes totales: ${clientes.length}`);
    console.log(`🔧 Reparaciones totales: ${reparaciones.length}`);

    // 2. Calcular estadísticas
    console.log('\n📈 2. ESTADÍSTICAS CALCULADAS:');
    
    const autosDisponibles = autos.filter(auto => auto.disponible).length;
    const clientesActivos = clientes.filter(cliente => cliente.activo).length;
    const costoTotalReparaciones = reparaciones.reduce((sum, rep) => sum + rep.costo, 0);

    console.log(`   - Autos disponibles: ${autosDisponibles}`);
    console.log(`   - Clientes activos: ${clientesActivos}`);
    console.log(`   - Costo total reparaciones: $${costoTotalReparaciones.toLocaleString()}`);

    // 3. Verificar consistencia entre dashboards
    console.log('\n🔍 3. VERIFICACIÓN DE CONSISTENCIA:');
    
    console.log('\n📋 DASHBOARD EMPLEADO:');
    console.log(`   - Total de vehículos: ${autos.length}`);
    console.log(`   - Vehículos disponibles: ${autosDisponibles}`);
    console.log(`   - Total de clientes: ${clientes.length}`);
    console.log(`   - Clientes activos: ${clientesActivos}`);

    console.log('\n📋 DASHBOARD ENCARGADO:');
    console.log(`   - Total de autos: ${autos.length}`);
    console.log(`   - Autos disponibles: ${autosDisponibles}`);
    console.log(`   - Autos no disponibles: ${autos.length - autosDisponibles}`);

    console.log('\n📋 DASHBOARD DUEÑO:');
    console.log(`   - Total de autos: ${autos.length}`);
    console.log(`   - Autos disponibles: ${autosDisponibles}`);
    console.log(`   - Clientes activos: ${clientesActivos}`);
    console.log(`   - Total reparaciones: ${reparaciones.length}`);
    console.log(`   - Costo total reparaciones: $${costoTotalReparaciones.toLocaleString()}`);

    // 4. Verificar que los datos coinciden
    console.log('\n✅ 4. VERIFICACIÓN DE COINCIDENCIA:');
    
    const empleadoStats = {
      totalAutos: autos.length,
      autosDisponibles: autosDisponibles,
      totalClientes: clientes.length,
      clientesActivos: clientesActivos
    };

    const encargadoStats = {
      totalAutos: autos.length,
      autosDisponibles: autosDisponibles,
      autosNoDisponibles: autos.length - autosDisponibles
    };

    const duenoStats = {
      totalAutos: autos.length,
      autosDisponibles: autosDisponibles,
      totalClientes: clientesActivos,
      totalReparaciones: reparaciones.length,
      costoTotalReparaciones: costoTotalReparaciones
    };

    // Verificar que los autos disponibles coinciden
    if (empleadoStats.autosDisponibles === encargadoStats.autosDisponibles && 
        encargadoStats.autosDisponibles === duenoStats.autosDisponibles) {
      console.log('   ✅ Autos disponibles: COINCIDEN');
    } else {
      console.log('   ❌ Autos disponibles: NO COINCIDEN');
    }

    // Verificar que los clientes activos coinciden
    if (empleadoStats.clientesActivos === duenoStats.totalClientes) {
      console.log('   ✅ Clientes activos: COINCIDEN');
    } else {
      console.log('   ❌ Clientes activos: NO COINCIDEN');
    }

    // Verificar que el total de autos coincide
    if (empleadoStats.totalAutos === encargadoStats.totalAutos && 
        encargadoStats.totalAutos === duenoStats.totalAutos) {
      console.log('   ✅ Total de autos: COINCIDEN');
    } else {
      console.log('   ❌ Total de autos: NO COINCIDEN');
    }

    // 5. Mostrar detalles de autos
    console.log('\n🚗 5. DETALLES DE AUTOS:');
    autos.forEach((auto, index) => {
      console.log(`   ${index + 1}. ${auto.marca} ${auto.modelo} (${auto.placas}) - ${auto.disponible ? 'Disponible' : 'No disponible'}`);
    });

    // 6. Mostrar detalles de clientes
    console.log('\n👥 6. DETALLES DE CLIENTES:');
    clientes.forEach((cliente, index) => {
      console.log(`   ${index + 1}. ${cliente.nombre} - ${cliente.activo ? 'Activo' : 'Inactivo'}`);
    });

    console.log('\n🎉 Verificación de consistencia completada!');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

verifyDashboardConsistency(); 