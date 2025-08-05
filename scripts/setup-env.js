// scripts/setup-env.js
const fs = require('fs');
const path = require('path');

function setupEnvironment() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  // Verificar si ya existe el archivo
  if (fs.existsSync(envPath)) {
    console.log('📝 El archivo .env.local ya existe');
    console.log('📍 Ubicación:', envPath);
    return;
  }

  // Contenido del archivo .env.local con MongoDB Atlas como principal
  const envContent = `# Configuración de MongoDB Atlas (Recomendado)
# Reemplaza esta URI con tu propia conexión de MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/

# Alternativa para MongoDB local (solo si no puedes usar Atlas):
# MONGODB_URI=mongodb://localhost:27017/ConAutos_DB
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env.local creado exitosamente');
    console.log('📍 Ubicación:', envPath);
    console.log('\n📋 Instrucciones para MongoDB Atlas:');
    console.log('6. Copia la URI de conexión y reemplaza "usuario" y "contraseña"');
    console.log('7. Guarda el archivo .env.local');
    console.log('8. Ejecuta: npm run dev');
    console.log('\n💡 MongoDB Atlas es gratuito y más fácil de configurar que MongoDB local');
  } catch (error) {
    console.error('❌ Error al crear el archivo .env.local:', error.message);
  }
}

setupEnvironment(); 