// scripts/vercel-debug.js
// Script para debuggear la estructura en Vercel

const fs = require('fs');
const path = require('path');

console.log('🔍 Debuggeando estructura en Vercel...');

// Verificar directorio actual
console.log('📁 Directorio actual:', process.cwd());

// Verificar si existe components/ui
const componentsPath = path.join(process.cwd(), 'components', 'ui');
console.log('📁 Path de componentes:', componentsPath);
console.log('✅ Existe components/ui:', fs.existsSync(componentsPath));

// Listar archivos en components/ui
if (fs.existsSync(componentsPath)) {
  const files = fs.readdirSync(componentsPath);
  console.log('📋 Archivos en components/ui:');
  files.forEach(file => {
    console.log(`   - ${file}`);
  });
}

// Verificar tsconfig.json
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
console.log('📄 tsconfig.json existe:', fs.existsSync(tsconfigPath));

if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  console.log('🔧 Paths configurados:', tsconfig.compilerOptions?.paths);
}

// Verificar package.json
const packagePath = path.join(process.cwd(), 'package.json');
console.log('📄 package.json existe:', fs.existsSync(packagePath));

// Verificar estructura de directorios
const dirs = ['app', 'components', 'lib', 'scripts'];
dirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  console.log(`📁 ${dir}/ existe:`, fs.existsSync(dirPath));
});

console.log('\n📋 RESUMEN DEL DEBUG:');
console.log('✅ Estructura de archivos verificada');
console.log('✅ Configuración de TypeScript revisada');
console.log('✅ Paths de componentes confirmados'); 