console.log('🔧 COMANDOS MONGODB PARA GESTIONAR REPARACIONES');
console.log('==================================================\n');

console.log('📋 1. ESTRUCTURA DE CAMPOS:');
console.log('============================');
console.log('\n// CAMPOS DE LA COLECCIÓN "autos":');
console.log('  _id: ObjectId');
console.log('  marca: String');
console.log('  modelo: String');
console.log('  año: Number');
console.log('  placas: String');
console.log('  disponible: Boolean');
console.log('  kilometraje: Number');
console.log('  categoria: String');
console.log('  fecha_ingreso: Date');

console.log('\n// CAMPOS DE LA COLECCIÓN "reparaciones":');
console.log('  _id: ObjectId');
console.log('  auto_id: String (referencia al _id del auto)');
console.log('  descripcion: String');
console.log('  costo: Number');
console.log('  fecha: Date');
console.log('  taller: String');

console.log('\n🔧 2. COMANDOS PARA CREAR REPARACIONES:');
console.log('==========================================');

console.log('\n// 1. Limpiar reparaciones existentes:');
console.log('db.reparaciones.deleteMany({})');

console.log('\n// 2. Crear reparaciones (ejemplo con IDs de autos):');
console.log('// NOTA: Reemplaza "AUTO_ID_1", "AUTO_ID_2", etc. con los IDs reales de tus autos');

console.log('\n// Reparación 1:');
console.log(`db.reparaciones.insertOne({
  auto_id: "AUTO_ID_1",
  descripcion: "Cambio de aceite y filtros",
  costo: 850,
  fecha: new Date("2024-01-15"),
  taller: "Taller Central"
})`);

console.log('\n// Reparación 2:');
console.log(`db.reparaciones.insertOne({
  auto_id: "AUTO_ID_1",
  descripcion: "Reparación de frenos",
  costo: 1200,
  fecha: new Date("2024-02-20"),
  taller: "Frenos Express"
})`);

console.log('\n// Reparación 3:');
console.log(`db.reparaciones.insertOne({
  auto_id: "AUTO_ID_1",
  descripcion: "Alineación y balanceo",
  costo: 450,
  fecha: new Date("2024-03-10"),
  taller: "Servicio Rápido"
})`);

console.log('\n// Reparación 4:');
console.log(`db.reparaciones.insertOne({
  auto_id: "AUTO_ID_2",
  descripcion: "Reparación de aire acondicionado",
  costo: 2100,
  fecha: new Date("2024-01-25"),
  taller: "Climas del Norte"
})`);

console.log('\n// Reparación 5:');
console.log(`db.reparaciones.insertOne({
  auto_id: "AUTO_ID_2",
  descripcion: "Cambio de llantas",
  costo: 1800,
  fecha: new Date("2024-02-15"),
  taller: "Llantas Plus"
})`);

console.log('\n// Reparación 6:');
console.log(`db.reparaciones.insertOne({
  auto_id: "AUTO_ID_3",
  descripcion: "Reparación de transmisión",
  costo: 3500,
  fecha: new Date("2024-01-30"),
  taller: "Transmisiones Especializadas"
})`);

console.log('\n🔍 3. COMANDOS DE CONSULTA:');
console.log('============================');

console.log('\n// Ver todas las reparaciones:');
console.log('db.reparaciones.find({})');

console.log('\n// Ver reparaciones de un auto específico:');
console.log('db.reparaciones.find({ auto_id: "AUTO_ID_1" })');

console.log('\n// Ver reparaciones con información del auto (agregación):');
console.log(`db.reparaciones.aggregate([
  {
    $lookup: {
      from: "autos",
      localField: "auto_id",
      foreignField: "_id",
      as: "auto"
    }
  },
  {
    $unwind: "$auto"
  },
  {
    $project: {
      descripcion: 1,
      costo: 1,
      fecha: 1,
      taller: 1,
      "auto.marca": 1,
      "auto.modelo": 1,
      "auto.placas": 1
    }
  }
])`);

console.log('\n// Contar reparaciones por auto:');
console.log(`db.reparaciones.aggregate([
  {
    $group: {
      _id: "$auto_id",
      total_reparaciones: { $sum: 1 },
      costo_total: { $sum: "$costo" }
    }
  },
  {
    $lookup: {
      from: "autos",
      localField: "_id",
      foreignField: "_id",
      as: "auto"
    }
  },
  {
    $unwind: "$auto"
  }
])`);

console.log('\n// Buscar reparaciones por descripción:');
console.log('db.reparaciones.find({ descripcion: { $regex: "frenos", $options: "i" } })');

console.log('\n// Buscar reparaciones por taller:');
console.log('db.reparaciones.find({ taller: "Taller Central" })');

console.log('\n// Reparaciones con costo mayor a 1000:');
console.log('db.reparaciones.find({ costo: { $gt: 1000 } })');

console.log('\n// Reparaciones de los últimos 3 meses:');
console.log('db.reparaciones.find({ fecha: { $gte: new Date("2024-01-01") } })');

console.log('\n📊 4. COMANDOS DE ACTUALIZACIÓN:');
console.log('==================================');

console.log('\n// Actualizar costo de una reparación:');
console.log(`db.reparaciones.updateOne(
  { _id: ObjectId("REPARACION_ID") },
  { $set: { costo: 950 } }
)`);

console.log('\n// Actualizar descripción de una reparación:');
console.log(`db.reparaciones.updateOne(
  { _id: ObjectId("REPARACION_ID") },
  { $set: { descripcion: "Cambio de aceite completo" } }
)`);

console.log('\n// Actualizar taller de una reparación:');
console.log(`db.reparaciones.updateOne(
  { _id: ObjectId("REPARACION_ID") },
  { $set: { taller: "Nuevo Taller" } }
)`);

console.log('\n⚠️  NOTAS IMPORTANTES:');
console.log('=======================');
console.log('1. Reemplaza "AUTO_ID_1", "AUTO_ID_2", etc. con los IDs reales de tus autos');
console.log('2. Reemplaza "REPARACION_ID" con el ID real de la reparación a actualizar');
console.log('3. El campo auto_id debe ser un String que coincida con el _id del auto');
console.log('4. Los costos deben ser números positivos');
console.log('5. Las fechas deben ser objetos Date válidos');
console.log('6. Todos los campos son obligatorios excepto _id (se genera automáticamente)');

console.log('\n✅ Comandos generados exitosamente!'); 