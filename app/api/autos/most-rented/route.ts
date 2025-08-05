import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// GET - Obtener autos más rentados en los últimos 2 meses
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const rentasCollection = db.collection('rentas')
    const autosCollection = db.collection('autos')

    // Calcular fecha de hace 2 meses
    const fechaLimite = new Date()
    fechaLimite.setMonth(fechaLimite.getMonth() - 2)

    console.log('🔍 Consultando autos más rentados desde:', fechaLimite.toISOString())

    // Pipeline de agregación para contar rentas por auto
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
    ]

    const autosMasRentados = await rentasCollection.aggregate(pipeline).toArray()

    console.log(`📊 Encontrados ${autosMasRentados.length} autos con rentas`)

    // Obtener información completa de cada auto
    const autosConInfo = await Promise.all(
      autosMasRentados.map(async (item) => {
        try {
          const autoId = typeof item._id === 'string' ? new ObjectId(item._id) : item._id
          const auto = await autosCollection.findOne({ _id: autoId })

          if (auto) {
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
            }
          } else {
            console.log(`⚠️ Auto no encontrado para ID: ${item._id}`)
            return null
          }
        } catch (error) {
          console.error('❌ Error obteniendo información del auto:', error)
          return null
        }
      })
    )

    // Filtrar resultados nulos
    const resultadosFiltrados = autosConInfo.filter(item => item !== null)

    console.log(`✅ Procesados ${resultadosFiltrados.length} autos con información completa`)

    return NextResponse.json({
      success: true,
      autosMasRentados: resultadosFiltrados,
      periodo: {
        desde: fechaLimite.toISOString(),
        hasta: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error obteniendo autos más rentados:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 