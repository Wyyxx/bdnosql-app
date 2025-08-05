const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando proyecto de Renta de Autos...\n');

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creando archivo .env.local...');
  
  const envContent = `# MongoDB Atlas Configuration
# Reemplaza con tu URL de conexión de MongoDB Atlas
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/ConAutos_DB?retryWrites=true&w=majority

# Next.js Configuration
NEXTAUTH_SECRET=tu_secret_key_aqui_cambiala_por_algo_seguro
NEXTAUTH_URL=http://localhost:3000

# Ejemplo de URL de MongoDB Atlas:
# MONGODB_URI=mongodb+srv://admin:password123@cluster0.abc123.mongodb.net/ConAutos_DB?retryWrites=true&w=majority
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado exitosamente');
  console.log('⚠️  IMPORTANTE: Edita el archivo .env.local con tu configuración de MongoDB Atlas');
} else {
  console.log('✅ Archivo .env.local ya existe');
}

// Verificar package.json
const packagePath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packagePath)) {
  console.log('❌ No se encontró package.json. Asegúrate de estar en el directorio correcto del proyecto.');
  process.exit(1);
}

console.log('\n📋 Pasos para completar la configuración:');
console.log('1. Configura MongoDB Atlas:');
console.log('   - Ve a https://www.mongodb.com/atlas');
console.log('   - Crea una cuenta gratuita');
console.log('   - Crea un cluster gratuito');
console.log('   - Crea un usuario de base de datos');
console.log('   - Obtén la URL de conexión');
console.log('   - Agrega tu IP a la whitelist');

console.log('\n2. Edita el archivo .env.local:');
console.log('   - Reemplaza MONGODB_URI con tu URL de conexión');
console.log('   - Cambia NEXTAUTH_SECRET por una clave segura');

console.log('\n3. Ejecuta los scripts de configuración:');
console.log('   node scripts/test-db.js');
console.log('   node scripts/test-users.js');
console.log('   node scripts/test-autos.js');
console.log('   node scripts/test-clientes.js');

console.log('\n4. Inicia el proyecto:');
console.log('   npm run dev');

console.log('\n5. Accede a http://localhost:3000');

console.log('\n👤 Usuarios de prueba:');
console.log('   Empleado: empleado@test.com / 123456');
console.log('   Encargado: encargado@test.com / 123456');
console.log('   Dueño: dueno@test.com / 123456');

console.log('\n🎉 ¡Configuración completada!');
console.log('📖 Revisa el README.md para más detalles'); 