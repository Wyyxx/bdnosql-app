// scripts/vercel-build.js
// Script específico para build en Vercel

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build para Vercel...');

try {
  // Limpiar directorios
  console.log('🧹 Limpiando directorios...');
  const dirsToClean = ['node_modules', '.next'];
  
  dirsToClean.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(dirPath)) {
      console.log(`🗑️  Eliminando ${dir}...`);
      execSync(`rm -rf ${dirPath}`, { stdio: 'inherit' });
    }
  });
  
  // Instalar dependencias
  console.log('📦 Instalando dependencias...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ Dependencias instaladas');
  
  // Verificar componentes
  console.log('🔍 Verificando componentes...');
  execSync('node scripts/verify-components.js', { stdio: 'inherit' });
  
  // Build del proyecto
  console.log('🏗️  Construyendo proyecto...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completado exitosamente');
  
  console.log('\n🎉 ¡Build para Vercel completado!');
  console.log('✅ Todos los componentes verificados');
  console.log('✅ Dependencias instaladas correctamente');
  console.log('✅ Proyecto construido sin errores');
  
} catch (error) {
  console.error('❌ Error durante el build:', error.message);
  process.exit(1);
} 