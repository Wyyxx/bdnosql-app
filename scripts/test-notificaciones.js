require('dotenv').config({ path: '.env.local' });

const { MongoClient, ObjectId } = require('mongodb');

async function testNotificaciones() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const notificacionesCollection = db.collection('notificaciones');
    const usuariosCollection = db.collection('usuarios');
    const devolucionesCollection = db.collection('devoluciones');
    const autosCollection = db.collection('autos');

    // 1. Verificar datos existentes
    console.log('\n📊 1. VERIFICANDO DATOS EXISTENTES:');
    
    const empleados = await usuariosCollection.find({ rol: 'empleado' }).toArray();
    const autos = await autosCollection.find({}).toArray();
    const notificaciones = await notificacionesCollection.find({}).toArray();

    console.log(`👥 Empleados: ${empleados.length}`);
    console.log(`🚗 Autos: ${autos.length}`);
    console.log(`🔔 Notificaciones existentes: ${notificaciones.length}`);

    if (empleados.length === 0) {
      console.log('❌ No hay empleados para enviar notificaciones');
      return;
    }

    if (autos.length === 0) {
      console.log('❌ No hay autos para crear devoluciones de prueba');
      return;
    }

    // 2. Crear notificaciones de prueba
    console.log('\n🧪 2. CREANDO NOTIFICACIONES DE PRUEBA:');
    
    const notificacionesPrueba = [
      {
        usuario_id: empleados[0]._id.toString(),
        titulo: '🚨 Vehículo Devuelto en Mal Estado',
        mensaje: `El vehículo ${autos[0].marca} ${autos[0].modelo} (${autos[0].placas}) ha sido devuelto en estado malo. Vehículo con daños en la puerta lateral y llanta desinflada.`,
        tipo: 'devolucion_alerta',
        datos_adicionales: {
          auto_id: autos[0]._id.toString(),
          estado_vehiculo: 'malo',
          observaciones: 'Vehículo con daños en la puerta lateral y llanta desinflada'
        },
        leida: false,
        fecha_creacion: new Date()
      },
      {
        usuario_id: empleados[0]._id.toString(),
        titulo: '⚠️ Vehículo Devuelto en Estado Regular',
        mensaje: `El vehículo ${autos[1] ? autos[1].marca : autos[0].marca} ${autos[1] ? autos[1].modelo : autos[0].modelo} (${autos[1] ? autos[1].placas : autos[0].placas}) ha sido devuelto en estado regular. Requiere revisión de mantenimiento.`,
        tipo: 'devolucion_alerta',
        datos_adicionales: {
          auto_id: autos[1] ? autos[1]._id.toString() : autos[0]._id.toString(),
          estado_vehiculo: 'regular',
          observaciones: 'Requiere revisión de mantenimiento'
        },
        leida: false,
        fecha_creacion: new Date()
      }
    ];

    for (let i = 0; i < notificacionesPrueba.length; i++) {
      const notificacion = notificacionesPrueba[i];
      console.log(`\nCreando notificación ${i + 1}:`);
      console.log(`  Título: ${notificacion.titulo}`);
      console.log(`  Tipo: ${notificacion.tipo}`);
      console.log(`  Para empleado: ${empleados[0].nombre}`);
      
      const resultado = await notificacionesCollection.insertOne(notificacion);
      console.log(`  ✅ Notificación creada con ID: ${resultado.insertedId}`);
    }

    // 3. Verificar estado final
    console.log('\n📋 3. VERIFICANDO ESTADO FINAL:');
    
    const notificacionesFinales = await notificacionesCollection.find({}).toArray();
    const notificacionesNoLeidas = notificacionesFinales.filter(n => !n.leida);

    console.log(`📊 Notificaciones totales: ${notificacionesFinales.length}`);
    console.log(`🔔 Notificaciones no leídas: ${notificacionesNoLeidas.length}`);

    // 4. Mostrar notificaciones por empleado
    console.log('\n👥 4. NOTIFICACIONES POR EMPLEADO:');
    
    for (const empleado of empleados) {
      const notificacionesEmpleado = notificacionesFinales.filter(n => n.usuario_id === empleado._id.toString());
      const noLeidas = notificacionesEmpleado.filter(n => !n.leida);
      
      console.log(`\nEmpleado: ${empleado.nombre} (${empleado.correo})`);
      console.log(`  Total notificaciones: ${notificacionesEmpleado.length}`);
      console.log(`  No leídas: ${noLeidas.length}`);
      
      if (notificacionesEmpleado.length > 0) {
        console.log(`  Últimas notificaciones:`);
        notificacionesEmpleado.slice(0, 3).forEach((notif, index) => {
          console.log(`    ${index + 1}. ${notif.titulo}`);
          console.log(`       ${notif.mensaje.substring(0, 50)}...`);
          console.log(`       Estado: ${notif.leida ? 'Leída' : 'No leída'}`);
        });
      }
    }

    console.log('\n🎉 Prueba de notificaciones completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

testNotificaciones(); 