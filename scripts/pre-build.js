// scripts/pre-build.js
// Script simple de pre-build para Vercel

const fs = require('fs');
const path = require('path');

console.log('🚀 Pre-build check para Vercel...');

// Verificar que los archivos críticos existan
const criticalFiles = [
  'components/ui/card.tsx',
  'components/ui/button.tsx',
  'components/ui/badge.tsx',
  'tsconfig.json',
  'package.json'
];

let allFilesExist = true;

criticalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANTE`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('❌ Faltan archivos críticos');
  process.exit(1);
}

console.log('\n✅ Pre-build check completado');
console.log('🚀 Listo para build'); 