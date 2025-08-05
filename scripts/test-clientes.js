const { MongoClient } = require('mongodb');

// Configuración de MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ConAutos_DB';

async function testClientes() {
  try {
    console.log('🔍 Probando APIs de clientes...');
    
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db("ConAutos_DB");
    const clientesCollection = db.collection('clientes');
    
    console.log('✅ Conexión exitosa a MongoDB');
    
    // 1. Listar clientes
    console.log('\n📋 1. Listando clientes...');
    const clientes = await clientesCollection.find({}).toArray();
    console.log(`   Total de clientes: ${clientes.length}`);
    
    if (clientes.length > 0) {
      console.log('   Primeros 3 clientes:');
      clientes.slice(0, 3).forEach((cliente, index) => {
        console.log(`   ${index + 1}. ${cliente.nombre} (${cliente.correo}) - Activo: ${cliente.activo}`);
      });
    }
    
    // 2. Crear nuevo cliente
    console.log('\n➕ 2. Creando nuevo cliente...');
    const nuevoCliente = {
      nombre: "María García",
      telefono: "6149988776",
      correo: "maria.garcia@email.com",
      direccion: "Av. Universidad 123, Chihuahua",
      activo: true,
      fecha_registro: new Date()
    };
    
    const resultadoCreacion = await clientesCollection.insertOne(nuevoCliente);
    console.log(`   ✅ Cliente creado con ID: ${resultadoCreacion.insertedId}`);
    
    // 3. Buscar cliente por correo
    console.log('\n🔍 3. Buscando cliente por correo...');
    const clienteEncontrado = await clientesCollection.findOne({
      correo: "maria.garcia@email.com"
    });
    
    if (clienteEncontrado) {
      console.log(`   ✅ Cliente encontrado: ${clienteEncontrado.nombre}`);
    } else {
      console.log('   ❌ Cliente no encontrado');
    }
    
    // 4. Actualizar cliente
    console.log('\n✏️  4. Actualizando cliente...');
    const resultadoActualizacion = await clientesCollection.updateOne(
      { correo: "maria.garcia@email.com" },
      { $set: { telefono: "6149988777" } }
    );
    
    if (resultadoActualizacion.modifiedCount > 0) {
      console.log('   ✅ Cliente actualizado exitosamente');
    } else {
      console.log('   ❌ No se pudo actualizar el cliente');
    }
    
    // 5. Verificar cliente actualizado
    console.log('\n🔍 5. Verificando cliente actualizado...');
    const clienteActualizado = await clientesCollection.findOne({
      correo: "maria.garcia@email.com"
    });
    
    if (clienteActualizado) {
      console.log(`   ✅ Cliente actualizado: ${clienteActualizado.nombre} - Tel: ${clienteActualizado.telefono}`);
    }
    
    // 6. Dar de baja cliente (baja lógica)
    console.log('\n🗑️  6. Dando de baja cliente...');
    const resultadoBaja = await clientesCollection.updateOne(
      { correo: "maria.garcia@email.com" },
      { $set: { activo: false } }
    );
    
    if (resultadoBaja.modifiedCount > 0) {
      console.log('   ✅ Cliente dado de baja exitosamente');
    } else {
      console.log('   ❌ No se pudo dar de baja el cliente');
    }
    
    // 7. Verificar estado final
    console.log('\n📊 7. Estado final de la base de datos...');
    const clientesActivos = await clientesCollection.find({ activo: true }).toArray();
    const clientesInactivos = await clientesCollection.find({ activo: false }).toArray();
    
    console.log(`   Clientes activos: ${clientesActivos.length}`);
    console.log(`   Clientes inactivos: ${clientesInactivos.length}`);
    console.log(`   Total de clientes: ${clientesActivos.length + clientesInactivos.length}`);
    
    // 8. Limpiar datos de prueba
    console.log('\n🧹 8. Limpiando datos de prueba...');
    const resultadoLimpieza = await clientesCollection.deleteOne({
      correo: "maria.garcia@email.com"
    });
    
    if (resultadoLimpieza.deletedCount > 0) {
      console.log('   ✅ Datos de prueba eliminados');
    } else {
      console.log('   ⚠️  No se encontraron datos de prueba para eliminar');
    }
    
    console.log('\n✅ Pruebas de clientes completadas exitosamente');
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error en pruebas de clientes:', error.message);
  }
}

testClientes(); 