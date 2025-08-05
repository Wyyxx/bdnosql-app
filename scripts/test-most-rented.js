require('dotenv').config({ path: '.env.local' });

const { MongoClient, ObjectId } = require('mongodb');

async function testMostRented() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db("ConAutos_DB");
    const rentasCollection = db.collection('rentas');
    const autosCollection = db.collection('autos');

    // 1. Verificar datos existentes
    console.log('\n📊 1. VERIFICANDO DATOS EXISTENTES:');
    
    const rentas = await rentasCollection.find({}).toArray();
    const autos = await autosCollection.find({}).toArray();

    console.log(`📋 Rentas totales: ${rentas.length}`);
    console.log(`🚗 Autos totales: ${autos.length}`);

    if (rentas.length === 0) {
      console.log('❌ No hay rentas para analizar');
      return;
    }

    // 2. Calcular fecha de hace 2 meses
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - 2);

    console.log(`\n📅 Analizando rentas desde: ${fechaLimite.toISOString()}`);

    // 3. Pipeline de agregación (igual que en la API)
    const pipeline = [
      {
        $match: {
          fecha_inicio: { $gte: fechaLimite }
        }
      },
      {
        $group: {
          _id: '$auto_id',
          totalRentas: { $sum: 1 },
          totalIngresos: { $sum: '$precio_total' },
          rentas: {
            $push: {
              fecha_inicio: '$fecha_inicio',
              fecha_fin: '$fecha_fin',
              precio_total: '$precio_total',
              estatus: '$estatus'
            }
          }
        }
      },
      {
        $sort: { totalRentas: -1 }
      },
      {
        $limit: 10
      }
    ];

    console.log('\n🔍 2. EJECUTANDO CONSULTA DE AGREGACIÓN:');
    const autosMasRentados = await rentasCollection.aggregate(pipeline).toArray();
    console.log(`📊 Encontrados ${autosMasRentados.length} autos con rentas`);

    // 4. Obtener información completa de cada auto
    console.log('\n📋 3. OBTENIENDO INFORMACIÓN COMPLETA:');
    const autosConInfo = await Promise.all(
      autosMasRentados.map(async (item, index) => {
        try {
          const autoId = typeof item._id === 'string' ? new ObjectId(item._id) : item._id;
          const auto = await autosCollection.findOne({ _id: autoId });

          if (auto) {
            console.log(`\n🏆 #${index + 1} - ${auto.marca} ${auto.modelo}`);
            console.log(`   Placas: ${auto.placas}`);
            console.log(`   Total Rentas: ${item.totalRentas}`);
            console.log(`   Total Ingresos: $${item.totalIngresos.toLocaleString()}`);
            console.log(`   Disponible: ${auto.disponible ? 'Sí' : 'No'}`);

            return {
              auto: {
                _id: auto._id,
                marca: auto.marca,
                modelo: auto.modelo,
                placas: auto.placas,
                categoria: auto.categoria,
                disponible: auto.disponible
              },
              totalRentas: item.totalRentas,
              totalIngresos: item.totalIngresos,
              rentas: item.rentas
            };
          } else {
            console.log(`⚠️ Auto no encontrado para ID: ${item._id}`);
            return null;
          }
        } catch (error) {
          console.log(`❌ Error obteniendo información del auto: ${error.message}`);
          return null;
        }
      })
    );

    // 5. Filtrar resultados nulos
    const resultadosFiltrados = autosConInfo.filter(item => item !== null);

    console.log(`\n✅ Procesados ${resultadosFiltrados.length} autos con información completa`);

    // 6. Mostrar resumen final
    console.log('\n📊 4. RESUMEN FINAL:');
    console.log(`Período analizado: ${fechaLimite.toLocaleDateString()} - ${new Date().toLocaleDateString()}`);
    console.log(`Autos más rentados encontrados: ${resultadosFiltrados.length}`);

    if (resultadosFiltrados.length > 0) {
      console.log('\n🏆 TOP 3 AUTOS MÁS RENTADOS:');
      resultadosFiltrados.slice(0, 3).forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.auto.marca} ${item.auto.modelo}`);
        console.log(`   Placas: ${item.auto.placas}`);
        console.log(`   Rentas: ${item.totalRentas}`);
        console.log(`   Ingresos: $${item.totalIngresos.toLocaleString()}`);
      });
    }

    console.log('\n🎉 Análisis completado exitosamente!');

  } catch (error) {
    console.error('❌ Error durante el análisis:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

testMostRented(); 