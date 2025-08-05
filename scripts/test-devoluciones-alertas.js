require('dotenv').config({ path: '.env.local' });

const { MongoClient, ObjectId } = require('mongodb');

async function testDevolucionesAlertas() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const devolucionesCollection = db.collection('devoluciones');
    const alertasCollection = db.collection('alertas');
    const rentasCollection = db.collection('rentas');
    const autosCollection = db.collection('autos');

    // 1. Verificar datos existentes
    console.log('\n📊 1. VERIFICANDO DATOS EXISTENTES:');
    
    const rentas = await rentasCollection.find({ estatus: 'activa' }).toArray();
    const autos = await autosCollection.find({}).toArray();
    const devoluciones = await devolucionesCollection.find({}).toArray();
    const alertas = await alertasCollection.find({}).toArray();

    console.log(`📋 Rentas activas: ${rentas.length}`);
    console.log(`🚗 Autos totales: ${autos.length}`);
    console.log(`🔄 Devoluciones existentes: ${devoluciones.length}`);
    console.log(`🚨 Alertas existentes: ${alertas.length}`);

    if (rentas.length === 0) {
      console.log('❌ No hay rentas activas para probar devoluciones');
      return;
    }

    // 2. Crear devoluciones de prueba
    console.log('\n🧪 2. CREANDO DEVOLUCIONES DE PRUEBA:');
    
    const devolucionesPrueba = [
      {
        renta_id: rentas[0]._id.toString(),
        auto_id: rentas[0].auto_id,
        fecha_devolucion: new Date(),
        estado_vehiculo: 'excelente',
        observaciones: 'Vehículo devuelto en perfecto estado',
        recibido_por: 'Encargado Test'
      },
      {
        renta_id: rentas[1] ? rentas[1]._id.toString() : rentas[0]._id.toString(),
        auto_id: rentas[1] ? rentas[1].auto_id : rentas[0].auto_id,
        fecha_devolucion: new Date(),
        estado_vehiculo: 'malo',
        observaciones: 'Vehículo con daños en la puerta lateral y llanta desinflada',
        recibido_por: 'Encargado Test'
      }
    ];

    for (let i = 0; i < devolucionesPrueba.length; i++) {
      const devolucion = devolucionesPrueba[i];
      console.log(`\nCreando devolución ${i + 1}:`);
      console.log(`  Estado: ${devolucion.estado_vehiculo}`);
      console.log(`  Observaciones: ${devolucion.observaciones}`);
      
      const resultado = await devolucionesCollection.insertOne(devolucion);
      console.log(`  ✅ Devolución creada con ID: ${resultado.insertedId}`);

      // Verificar si se creó una alerta
      if (devolucion.estado_vehiculo === 'malo' || devolucion.estado_vehiculo === 'regular') {
        const alertaCreada = await alertasCollection.findOne({
          auto_id: devolucion.auto_id,
          tipo: 'vehiculo_mal_estado'
        });
        
        if (alertaCreada) {
          console.log(`  🚨 Alerta creada automáticamente: ${alertaCreada.mensaje}`);
        } else {
          console.log(`  ⚠️ No se creó alerta automática`);
        }
      }
    }

    // 3. Verificar estado final
    console.log('\n📋 3. VERIFICANDO ESTADO FINAL:');
    
    const devolucionesFinales = await devolucionesCollection.find({}).toArray();
    const alertasFinales = await alertasCollection.find({}).toArray();
    const rentasActualizadas = await rentasCollection.find({}).toArray();

    console.log(`📊 Devoluciones totales: ${devolucionesFinales.length}`);
    console.log(`🚨 Alertas totales: ${alertasFinales.length}`);
    console.log(`📋 Rentas finalizadas: ${rentasActualizadas.filter(r => r.estatus === 'finalizada').length}`);

    // 4. Mostrar alertas activas
    console.log('\n🚨 4. ALERTAS ACTIVAS:');
    const alertasActivas = alertasFinales.filter(a => !a.resuelta);
    
    if (alertasActivas.length > 0) {
      alertasActivas.forEach((alerta, index) => {
        console.log(`\nAlerta ${index + 1}:`);
        console.log(`  Tipo: ${alerta.tipo}`);
        console.log(`  Severidad: ${alerta.severidad}`);
        console.log(`  Mensaje: ${alerta.mensaje}`);
        console.log(`  Creada por: ${alerta.creada_por}`);
        console.log(`  Fecha: ${alerta.fecha_creacion}`);
      });
    } else {
      console.log('  No hay alertas activas');
    }

    // 5. Mostrar resumen de devoluciones
    console.log('\n📊 5. RESUMEN DE DEVOLUCIONES:');
    devolucionesFinales.forEach((devolucion, index) => {
      console.log(`\nDevolución ${index + 1}:`);
      console.log(`  Estado: ${devolucion.estado_vehiculo}`);
      console.log(`  Recibido por: ${devolucion.recibido_por}`);
      console.log(`  Fecha: ${devolucion.fecha_devolucion}`);
      console.log(`  Observaciones: ${devolucion.observaciones}`);
    });

    console.log('\n🎉 Prueba de devoluciones y alertas completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

testDevolucionesAlertas(); 