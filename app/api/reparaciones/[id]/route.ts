import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// GET - Obtener reparación específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { db } = await connectToDatabase()
    const reparacionesCollection = db.collection('reparaciones')

    const reparacion = await reparacionesCollection.findOne({
      _id: new ObjectId(id)
    })

    if (!reparacion) {
      return NextResponse.json(
        { error: 'Reparación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      reparacion
    })

  } catch (error) {
    console.error('Error obteniendo reparación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar reparación
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { auto_id, descripcion, costo, fecha, taller } = await request.json()

    // Validaciones
    if (!auto_id || !descripcion || !costo || !fecha || !taller) {
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

    // Verificar si la reparación existe
    const reparacionExistente = await reparacionesCollection.findOne({
      _id: new ObjectId(id)
    })

    if (!reparacionExistente) {
      return NextResponse.json(
        { error: 'Reparación no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que el auto existe
    const autoExistente = await autosCollection.findOne({ _id: auto_id })
    if (!autoExistente) {
      return NextResponse.json(
        { error: 'El auto especificado no existe' },
        { status: 404 }
      )
    }

    // Actualizar reparación
    const reparacionActualizada = {
      auto_id,
      descripcion,
      costo: parseFloat(costo),
      fecha: new Date(fecha),
      taller
    }

    const resultado = await reparacionesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: reparacionActualizada }
    )

    if (resultado.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Reparación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Reparación actualizada exitosamente',
      reparacion: { _id: id, ...reparacionActualizada }
    })

  } catch (error) {
    console.error('Error actualizando reparación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 