import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'

// GET - Reporte de reparaciones con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fechaInicio = searchParams.get('fecha_inicio')
    const fechaFin = searchParams.get('fecha_fin')
    const montoMinimo = searchParams.get('monto_minimo')
    const montoMaximo = searchParams.get('monto_maximo')

    const { db } = await connectToDatabase()
    const reparacionesCollection = db.collection('reparaciones')
    const autosCollection = db.collection('autos')

    // Construir filtros
    let filtro: any = {}
    
    // Filtro por fechas
    if (fechaInicio || fechaFin) {
      filtro.fecha = {}
      if (fechaInicio) {
        filtro.fecha.$gte = new Date(fechaInicio)
      }
      if (fechaFin) {
        filtro.fecha.$lte = new Date(fechaFin + 'T23:59:59.999Z')
      }
    }
    
    // Filtro por monto
    if (montoMinimo || montoMaximo) {
      filtro.costo = {}
      if (montoMinimo) {
        filtro.costo.$gte = parseFloat(montoMinimo)
      }
      if (montoMaximo) {
        filtro.costo.$lte = parseFloat(montoMaximo)
      }
    }

    console.log('🔍 Filtros aplicados:', filtro)

    // Obtener reparaciones con filtros
    const reparaciones = await reparacionesCollection.find(filtro).toArray()
    
    console.log(`📊 Reparaciones encontradas: ${reparaciones.length}`)

    // Obtener información de autos para cada reparación
    const reparacionesConAutos = await Promise.all(
      reparaciones.map(async (reparacion) => {
        try {
          const auto = await autosCollection.findOne({ _id: reparacion.auto_id })
          return {
            ...reparacion,
            auto: auto ? {
              marca: auto.marca,
              modelo: auto.modelo,
              placas: auto.placas
            } : null
          }
        } catch (error) {
          console.error('Error obteniendo auto:', error)
          return {
            ...reparacion,
            auto: null
          }
        }
      })
    )

    // Calcular totales
    const totalCosto = reparaciones.reduce((sum, reparacion) => sum + reparacion.costo, 0)
    const cantidad = reparaciones.length

    console.log(`💰 Total costo: $${totalCosto.toLocaleString()}`)
    console.log(`📈 Cantidad: ${cantidad}`)

    return NextResponse.json({
      success: true,
      reparaciones: reparacionesConAutos,
      total_costo: totalCosto,
      cantidad: cantidad,
      filtros_aplicados: {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        monto_minimo: montoMinimo,
        monto_maximo: montoMaximo
      }
    })

  } catch (error) {
    console.error('Error obteniendo reporte de reparaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 