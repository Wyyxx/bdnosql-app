import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// GET - Listar alertas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const resuelta = searchParams.get('resuelta')

    const { db } = await connectToDatabase()
    const alertasCollection = db.collection('alertas')
    const autosCollection = db.collection('autos')

    // Construir filtros
    let filtro: any = {}
    
    if (tipo) {
      filtro.tipo = tipo
    }
    
    if (resuelta !== null) {
      filtro.resuelta = resuelta === 'true'
    }

    const alertas = await alertasCollection.find(filtro).sort({ fecha_creacion: -1 }).toArray()

    // Obtener información de autos para cada alerta
    const alertasConInfo = await Promise.all(
      alertas.map(async (alerta) => {
        try {
          let auto = null
          
          // Obtener información del auto
          try {
            if (alerta.auto_id) {
              const autoId = typeof alerta.auto_id === 'string' ? new ObjectId(alerta.auto_id) : alerta.auto_id
              auto = await autosCollection.findOne({ _id: autoId })
            }
          } catch (error) {
            console.error('Error obteniendo auto:', error)
          }
          
          return {
            ...alerta,
            auto: auto ? {
              marca: auto.marca,
              modelo: auto.modelo,
              placas: auto.placas,
              categoria: auto.categoria
            } : null
          }
        } catch (error) {
          console.error('Error procesando alerta:', error)
          return {
            ...alerta,
            auto: null
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      alertas: alertasConInfo
    })

  } catch (error) {
    console.error('Error obteniendo alertas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva alerta
export async function POST(request: NextRequest) {
  try {
    const { 
      auto_id, 
      tipo, 
      mensaje, 
      severidad, 
      creada_por 
    } = await request.json()

    console.log('🚨 Creando alerta:', { 
      auto_id, 
      tipo, 
      mensaje, 
      severidad, 
      creada_por 
    })

    // Validaciones
    if (!auto_id || !tipo || !mensaje || !severidad || !creada_por) {
      console.log('❌ Validación fallida:', { 
        auto_id: !!auto_id, 
        tipo: !!tipo, 
        mensaje: !!mensaje, 
        severidad: !!severidad, 
        creada_por: !!creada_por 
      })
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const alertasCollection = db.collection('alertas')
    const autosCollection = db.collection('autos')

    // Verificar que el auto existe
    console.log('🔍 Verificando auto con ID:', auto_id)
    const autoExistente = await autosCollection.findOne({ _id: new ObjectId(auto_id) })
    console.log('🔍 Auto encontrado:', autoExistente ? 'Sí' : 'No')
    
    if (!autoExistente) {
      console.log('❌ Auto no encontrado')
      return NextResponse.json(
        { error: 'El auto especificado no existe' },
        { status: 404 }
      )
    }

    // Crear nueva alerta
    const nuevaAlerta = {
      auto_id,
      tipo,
      mensaje,
      severidad,
      creada_por,
      resuelta: false,
      fecha_creacion: new Date(),
      fecha_resolucion: null
    }

    console.log('💾 Insertando alerta:', nuevaAlerta)
    const resultado = await alertasCollection.insertOne(nuevaAlerta)
    console.log('✅ Alerta creada con ID:', resultado.insertedId)

    return NextResponse.json({
      success: true,
      message: 'Alerta creada exitosamente',
      alerta: { _id: resultado.insertedId, ...nuevaAlerta }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando alerta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 