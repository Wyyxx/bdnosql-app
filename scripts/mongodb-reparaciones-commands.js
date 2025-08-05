const { MongoClient, ObjectId } = require('mongodb');

async function showMongoDBCommands() {
  const uri = "mongodb+srv://ricky:ricky123@cluster0.mongodb.net/ConAutos_DB?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const autosCollection = db.collection('autos');
    const reparacionesCollection = db.collection('reparaciones');

    // 1. Obtener autos existentes
    console.log('\n📋 1. AUTOS DISPONIBLES:');
    const autos = await autosCollection.find({}).toArray();
    
    if (autos.length === 0) {
      console.log('❌ No hay autos disponibles');
      return;
    }

    autos.forEach((auto, index) => {
      console.log(`\n🚗 AUTO ${index + 1}:`);
      console.log(`   ID: ${auto._id}`);
      console.log(`   Marca: ${auto.marca}`);
      console.log(`   Modelo: ${auto.modelo}`);
      console.log(`   Año: ${auto.año}`);
      console.log(`   Placas: ${auto.placas}`);
      console.log(`   Categoría: ${auto.categoria}`);
      console.log(`   Kilometraje: ${auto.kilometraje}`);
      console.log(`   Disponible: ${auto.disponible}`);
    });

    // 2. Mostrar comandos MongoDB para crear reparaciones
    console.log('\n🔧 2. COMANDOS MONGODB PARA CREAR REPARACIONES:');
    console.log('\n--- COMANDO PARA LIMPIAR REPARACIONES EXISTENTES ---');
    console.log('db.reparaciones.deleteMany({})');
    
    console.log('\n--- COMANDOS PARA CREAR REPARACIONES ---');
    
    autos.forEach((auto, index) => {
      const autoId = auto._id.toString();
      
      console.log(`\n// Reparaciones para ${auto.marca} ${auto.modelo} (${auto.placas}):`);
      
      // Reparación 1
      console.log(`db.reparaciones.insertOne({`);
      console.log(`  auto_id: "${autoId}",`);
      console.log(`  descripcion: "Cambio de aceite y filtros",`);
      console.log(`  costo: 850,`);
      console.log(`  fecha: new Date("2024-01-15"),`);
      console.log(`  taller: "Taller Central"`);
      console.log(`})`);
      
      // Reparación 2
      console.log(`\ndb.reparaciones.insertOne({`);
      console.log(`  auto_id: "${autoId}",`);
      console.log(`  descripcion: "Reparación de frenos",`);
      console.log(`  costo: 1200,`);
      console.log(`  fecha: new Date("2024-02-20"),`);
      console.log(`  taller: "Frenos Express"`);
      console.log(`})`);
      
      // Reparación 3
      console.log(`\ndb.reparaciones.insertOne({`);
      console.log(`  auto_id: "${autoId}",`);
      console.log(`  descripcion: "Alineación y balanceo",`);
      console.log(`  costo: 450,`);
      console.log(`  fecha: new Date("2024-03-10"),`);
      console.log(`  taller: "Servicio Rápido"`);
      console.log(`})`);
    });

    // 3. Mostrar comandos de consulta
    console.log('\n🔍 3. COMANDOS DE CONSULTA:');
    console.log('\n// Ver todas las reparaciones:');
    console.log('db.reparaciones.find({})');
    
    console.log('\n// Ver reparaciones de un auto específico:');
    if (autos.length > 0) {
      console.log(`db.reparaciones.find({ auto_id: "${autos[0]._id.toString()}" })`);
    }
    
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

    // 4. Mostrar estructura de campos
    console.log('\n📊 4. ESTRUCTURA DE CAMPOS:');
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

    console.log('\n✅ Comandos generados exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

showMongoDBCommands(); 