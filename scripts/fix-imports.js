// scripts/fix-imports.js
// Script para convertir imports @/ a relativos

const fs = require('fs');
const path = require('path');

console.log('🔧 Convirtiendo imports @/ a relativos...');

// Función para convertir @/ a ruta relativa
function convertImport(importPath, currentFile) {
  if (importPath.startsWith('@/')) {
    const relativePath = importPath.replace('@/', '../../');
    return relativePath;
  }
  return importPath;
}

// Función para procesar un archivo
function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Buscar imports que usen @/
  const importRegex = /import\s+.*from\s+['"](@\/[^'"]+)['"]/g;
  let newContent = content.replace(importRegex, (match, importPath) => {
    const relativePath = convertImport(importPath, filePath);
    modified = true;
    console.log(`   ${importPath} -> ${relativePath}`);
    return match.replace(importPath, relativePath);
  });
  
  if (modified) {
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Procesado: ${filePath}`);
  }
}

// Procesar archivos específicos que están fallando
const filesToProcess = [
  'app/alerts/page.tsx',
  'app/cars/most-rented/page.tsx'
];

console.log('📁 Procesando archivos...');
filesToProcess.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  processFile(filePath);
});

console.log('\n✅ Conversión de imports completada');
console.log('🔧 Los imports @/ han sido convertidos a relativos'); 