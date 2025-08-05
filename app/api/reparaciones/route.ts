import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// GET - Listar reparaciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const auto_id = searchParams.get('auto_id')
    const search = searchParams.get('search')

    const { db } = await connectToDatabase()
    const reparacionesCollection = db.collection('reparaciones')

    // Construir filtros
    let filtro: any = {}
    
    if (auto_id) {
      filtro.auto_id = auto_id
    }
    
    if (search) {
      filtro.$or = [
        { descripcion: { $regex: search, $options: 'i' } },
        { taller: { $regex: search, $options: 'i' } }
      ]
    }

    const reparaciones = await reparacionesCollection.find(filtro).toArray()

    return NextResponse.json({
      success: true,
      reparaciones
    })

  } catch (error) {
    console.error('Error obteniendo reparaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva reparación
export async function POST(request: NextRequest) {
  try {
    const { auto_id, descripcion, costo, fecha, taller } = await request.json()

    console.log('🔧 Creando reparación:', { auto_id, descripcion, costo, fecha, taller })

    // Validaciones
    if (!auto_id || !descripcion || !costo || !fecha || !taller) {
      console.log('❌ Validación fallida:', { auto_id: !!auto_id, descripcion: !!descripcion, costo: !!costo, fecha: !!fecha, taller: !!taller })
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Validar costo
    if (costo <= 0) {
      return NextResponse.json(
        { error: 'El costo debe ser mayor a 0' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const reparacionesCollection = db.collection('reparaciones')
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

    // Crear nueva reparación
    const nuevaReparacion = {
      auto_id,
      descripcion,
      costo: parseFloat(costo),
      fecha: new Date(fecha),
      taller
    }

    console.log('💾 Insertando reparación:', nuevaReparacion)
    const resultado = await reparacionesCollection.insertOne(nuevaReparacion)
    console.log('✅ Reparación creada con ID:', resultado.insertedId)

    return NextResponse.json({
      success: true,
      message: 'Reparación registrada exitosamente',
      reparacion: { _id: resultado.insertedId, ...nuevaReparacion }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando reparación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 