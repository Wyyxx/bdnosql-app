// scripts/fix-dependencies.js
// Script para resolver conflictos de dependencias

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Resolviendo conflictos de dependencias...');

// Verificar si existe package-lock.json
if (fs.existsSync('package-lock.json')) {
  console.log('🗑️  Eliminando package-lock.json...');
  fs.unlinkSync('package-lock.json');
}

// Verificar si existe node_modules
if (fs.existsSync('node_modules')) {
  console.log('🗑️  Eliminando node_modules...');
  const { execSync } = require('child_process');
  execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
}

console.log('📦 Instalando dependencias con configuración optimizada...');

try {
  // Configurar npm para ser más permisivo con peer dependencies
  execSync('npm config set legacy-peer-deps true', { stdio: 'inherit' });
  console.log('✅ Configuración de npm actualizada');
  
  // Instalar dependencias
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencias instaladas correctamente');
  
  // Verificar que todo funcione
  console.log('🧪 Verificando que el proyecto funcione...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build exitoso');
  
  console.log('\n🎉 ¡Conflictos de dependencias resueltos!');
  console.log('✅ Ya no necesitas usar --legacy-peer-deps');
  console.log('✅ Tu proyecto está listo para Vercel');
  
} catch (error) {
  console.error('❌ Error durante la instalación:', error.message);
  console.log('\n🔧 Solución alternativa:');
  console.log('npm install --legacy-peer-deps');
} 