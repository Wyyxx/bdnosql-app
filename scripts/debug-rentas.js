const { MongoClient, ObjectId } = require('mongodb');

async function debugRentas() {
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
    
    const rentas = await rentasCollection.find({}).toArray();
    const clientes = await clientesCollection.find({}).toArray();
    const autos = await autosCollection.find({}).toArray();

    console.log(`📋 Rentas totales: ${rentas.length}`);
    console.log(`👥 Clientes totales: ${clientes.length}`);
    console.log(`🚗 Autos totales: ${autos.length}`);

    // 2. Mostrar algunas rentas con sus IDs
    console.log('\n📋 2. MUESTRANDO RENTAS:');
    rentas.slice(0, 3).forEach((renta, index) => {
      console.log(`\nRenta ${index + 1}:`);
      console.log(`  _id: ${renta._id}`);
      console.log(`  cliente_id: ${renta.cliente_id} (tipo: ${typeof renta.cliente_id})`);
      console.log(`  auto_id: ${renta.auto_id} (tipo: ${typeof renta.auto_id})`);
      console.log(`  fecha_inicio: ${renta.fecha_inicio}`);
      console.log(`  fecha_fin: ${renta.fecha_fin}`);
      console.log(`  precio_total: ${renta.precio_total}`);
      console.log(`  estatus: ${renta.estatus}`);
    });

    // 3. Mostrar algunos clientes con sus IDs
    console.log('\n👥 3. MUESTRANDO CLIENTES:');
    clientes.slice(0, 3).forEach((cliente, index) => {
      console.log(`\nCliente ${index + 1}:`);
      console.log(`  _id: ${cliente._id}`);
      console.log(`  nombre: ${cliente.nombre}`);
      console.log(`  correo: ${cliente.correo}`);
      console.log(`  activo: ${cliente.activo}`);
    });

    // 4. Mostrar algunos autos con sus IDs
    console.log('\n🚗 4. MUESTRANDO AUTOS:');
    autos.slice(0, 3).forEach((auto, index) => {
      console.log(`\nAuto ${index + 1}:`);
      console.log(`  _id: ${auto._id}`);
      console.log(`  marca: ${auto.marca}`);
      console.log(`  modelo: ${auto.modelo}`);
      console.log(`  placas: ${auto.placas}`);
      console.log(`  disponible: ${auto.disponible}`);
    });

    // 5. Intentar hacer las consultas que hace la API
    console.log('\n🔍 5. PROBANDO CONSULTAS DE LA API:');
    
    if (rentas.length > 0) {
      const primeraRenta = rentas[0];
      console.log(`\nProbando con la primera renta:`);
      console.log(`cliente_id: ${primeraRenta.cliente_id}`);
      console.log(`auto_id: ${primeraRenta.auto_id}`);
      
      // Intentar obtener cliente
      try {
        const clienteId = typeof primeraRenta.cliente_id === 'string' ? 
          new ObjectId(primeraRenta.cliente_id) : primeraRenta.cliente_id;
        const cliente = await clientesCollection.findOne({ _id: clienteId });
        console.log(`✅ Cliente encontrado: ${cliente ? cliente.nombre : 'No encontrado'}`);
      } catch (error) {
        console.log(`❌ Error obteniendo cliente: ${error.message}`);
      }
      
      // Intentar obtener auto
      try {
        const autoId = typeof primeraRenta.auto_id === 'string' ? 
          new ObjectId(primeraRenta.auto_id) : primeraRenta.auto_id;
        const auto = await autosCollection.findOne({ _id: autoId });
        console.log(`✅ Auto encontrado: ${auto ? `${auto.marca} ${auto.modelo}` : 'No encontrado'}`);
      } catch (error) {
        console.log(`❌ Error obteniendo auto: ${error.message}`);
      }
    }

    // 6. Verificar si hay inconsistencias en los IDs
    console.log('\n🔍 6. VERIFICANDO INCONSISTENCIAS:');
    
    const clienteIdsEnRentas = [...new Set(rentas.map(r => r.cliente_id))];
    const autoIdsEnRentas = [...new Set(rentas.map(r => r.auto_id))];
    
    console.log(`IDs de clientes en rentas: ${clienteIdsEnRentas.length}`);
    console.log(`IDs de autos en rentas: ${autoIdsEnRentas.length}`);
    
    // Verificar si los IDs de clientes existen
    let clientesEncontrados = 0;
    for (const clienteId of clienteIdsEnRentas) {
      try {
        const clienteIdObj = typeof clienteId === 'string' ? new ObjectId(clienteId) : clienteId;
        const cliente = await clientesCollection.findOne({ _id: clienteIdObj });
        if (cliente) clientesEncontrados++;
      } catch (error) {
        console.log(`❌ Error verificando cliente ${clienteId}: ${error.message}`);
      }
    }
    console.log(`Clientes encontrados: ${clientesEncontrados}/${clienteIdsEnRentas.length}`);
    
    // Verificar si los IDs de autos existen
    let autosEncontrados = 0;
    for (const autoId of autoIdsEnRentas) {
      try {
        const autoIdObj = typeof autoId === 'string' ? new ObjectId(autoId) : autoId;
        const auto = await autosCollection.findOne({ _id: autoIdObj });
        if (auto) autosEncontrados++;
      } catch (error) {
        console.log(`❌ Error verificando auto ${autoId}: ${error.message}`);
      }
    }
    console.log(`Autos encontrados: ${autosEncontrados}/${autoIdsEnRentas.length}`);

    console.log('\n🎉 Diagnóstico completado!');

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

debugRentas(); 