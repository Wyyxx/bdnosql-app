const { MongoClient } = require('mongodb');

// Configuración de MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ConAutos_DB';

async function testLogin() {
  try {
    console.log('🔍 Probando conexión a MongoDB...');
    
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db("ConAutos_DB");
    const usuariosCollection = db.collection('usuarios');
    
    console.log('✅ Conexión exitosa a MongoDB');
    
    // Buscar usuarios en la colección
    const usuarios = await usuariosCollection.find({}).toArray();
    console.log(`📊 Usuarios encontrados: ${usuarios.length}`);
    
    if (usuarios.length > 0) {
      console.log('\n👥 Usuarios disponibles para login:');
      usuarios.forEach((usuario, index) => {
        console.log(`${index + 1}. ${usuario.nombre} (${usuario.correo}) - Rol: ${usuario.rol} - Activo: ${usuario.activo}`);
      });
      
      console.log('\n🧪 Probando login con TODOS los usuarios:');
      
      // Probar login con todos los usuarios
      for (let i = 0; i < usuarios.length; i++) {
        const testUser = usuarios[i];
        console.log(`\n--- Usuario ${i + 1}: ${testUser.nombre} ---`);
        
        // Verificar si el usuario está activo
        if (!testUser.activo) {
          console.log('❌ Usuario inactivo');
          continue;
        }
        
        // Probar login
        const loginResult = await usuariosCollection.findOne({
          correo: testUser.correo,
          contraseña: testUser.contraseña,
          activo: true
        });
        
        if (loginResult) {
          console.log('✅ Login exitoso!');
          console.log(`   Usuario: ${loginResult.nombre}`);
          console.log(`   Correo: ${loginResult.correo}`);
          console.log(`   Rol: ${loginResult.rol}`);
          console.log(`   Activo: ${loginResult.activo}`);
        } else {
          console.log('❌ Login fallido');
          console.log(`   Correo: ${testUser.correo}`);
          console.log(`   Contraseña proporcionada: ${testUser.contraseña}`);
        }
      }
      
      console.log('\n📋 Resumen de prueba:');
      console.log(`Total de usuarios: ${usuarios.length}`);
      const usuariosActivos = usuarios.filter(u => u.activo);
      console.log(`Usuarios activos: ${usuariosActivos.length}`);
      
    } else {
      console.log('⚠️  No se encontraron usuarios en la base de datos');
    }
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin(); 