// scripts/vercel-check.js
// Script para verificar la configuración en Vercel

console.log('🔍 Verificando configuración para Vercel...');

// Verificar variables de entorno críticas
const requiredEnvVars = [
  'MONGODB_URI'
];

const missingVars = [];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
    console.log(`❌ Falta: ${varName}`);
  } else {
    console.log(`✅ ${varName}: Configurada`);
  }
});

if (missingVars.length > 0) {
  console.log('\n⚠️  VARIABLES FALTANTES:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Para configurar en Vercel:');
  console.log('   1. Ve al dashboard de Vercel');
  console.log('   2. Selecciona tu proyecto');
  console.log('   3. Ve a Settings > Environment Variables');
  console.log('   4. Agrega las variables faltantes');
  console.log('\n🔗 MongoDB Atlas:');
  console.log('   - Asegúrate de que tu cluster permita conexiones desde Vercel');
  console.log('   - Verifica que la IP 0.0.0.0/0 esté en la whitelist');
  process.exit(1);
} else {
  console.log('\n✅ Todas las variables están configuradas correctamente');
  console.log('🚀 Tu proyecto debería funcionar en Vercel');
}

// Verificar formato de MONGODB_URI
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  if (mongoUri.includes('mongodb+srv://')) {
    console.log('✅ MONGODB_URI: Formato Atlas correcto');
  } else if (mongoUri.includes('mongodb://')) {
    console.log('⚠️  MONGODB_URI: Formato local detectado');
    console.log('   Para producción, usa MongoDB Atlas');
  } else {
    console.log('❌ MONGODB_URI: Formato incorrecto');
  }
} 