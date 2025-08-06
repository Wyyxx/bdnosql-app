// scripts/vercel-install.js
// Script específico para instalación en Vercel

const { execSync } = require('child_process');

console.log('🚀 Instalando dependencias para Vercel...');

try {
  // Instalar con legacy-peer-deps para evitar conflictos
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ Dependencias instaladas correctamente');
  
  // Verificar que el build funcione
  console.log('🧪 Verificando build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build exitoso para Vercel');
  
} catch (error) {
  console.error('❌ Error durante la instalación:', error.message);
  process.exit(1);
} 