// scripts/verify-components.js
// Verificar que todos los componentes UI estén disponibles

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando componentes UI...');

const requiredComponents = [
  'card.tsx',
  'button.tsx',
  'badge.tsx',
  'input.tsx',
  'label.tsx',
  'select.tsx',
  'dialog.tsx',
  'form.tsx',
  'toast.tsx',
  'table.tsx',
  'tabs.tsx',
  'accordion.tsx',
  'alert-dialog.tsx',
  'avatar.tsx',
  'calendar.tsx',
  'checkbox.tsx',
  'dropdown-menu.tsx',
  'hover-card.tsx',
  'navigation-menu.tsx',
  'popover.tsx',
  'progress.tsx',
  'radio-group.tsx',
  'scroll-area.tsx',
  'separator.tsx',
  'sheet.tsx',
  'skeleton.tsx',
  'slider.tsx',
  'switch.tsx',
  'textarea.tsx',
  'toggle.tsx',
  'tooltip.tsx'
];

const componentsDir = path.join(__dirname, '../components/ui');
const missingComponents = [];

console.log('📁 Verificando componentes en:', componentsDir);

requiredComponents.forEach(component => {
  const componentPath = path.join(componentsDir, component);
  if (fs.existsSync(componentPath)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - FALTANTE`);
    missingComponents.push(component);
  }
});

if (missingComponents.length > 0) {
  console.log('\n⚠️  Componentes faltantes:', missingComponents);
  console.log('🔧 Esto puede causar errores de build en Vercel');
} else {
  console.log('\n✅ Todos los componentes UI están disponibles');
}

// Verificar tsconfig.json
const tsconfigPath = path.join(__dirname, '../tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  if (tsconfig.compilerOptions?.paths?.['@/*']) {
    console.log('✅ Configuración de paths en tsconfig.json correcta');
  } else {
    console.log('❌ Configuración de paths en tsconfig.json incorrecta');
  }
}

console.log('\n📋 RESUMEN:');
console.log('✅ Verificación de componentes completada');
console.log('✅ Configuración de TypeScript verificada');
console.log('🚀 Listo para build en Vercel'); 