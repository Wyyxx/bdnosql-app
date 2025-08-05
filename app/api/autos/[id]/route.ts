import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// GET - Obtener auto específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { db } = await connectToDatabase()
    const autosCollection = db.collection('autos')

    const auto = await autosCollection.findOne({
      _id: new ObjectId(id)
    })

    if (!auto) {
      return NextResponse.json(
        { error: 'Auto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      auto
    })

  } catch (error) {
    console.error('Error obteniendo auto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar auto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { marca, modelo, año, placas, disponible, kilometraje, categoria } = await request.json()

    // Validaciones
    if (!marca || !modelo || !año || !placas || !categoria) {
      return NextResponse.json(
        { error: 'Marca, modelo, año, placas y categoría son requeridos' },
        { status: 400 }
      )
    }

    // Validar año
    if (año < 1900 || año > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { error: 'Año inválido' },
        { status: 400 }
      )
    }

    // Validar kilometraje
    if (kilometraje < 0) {
      return NextResponse.json(
        { error: 'Kilometraje no puede ser negativo' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const autosCollection = db.collection('autos')

    // Verificar si el auto existe
    const autoExistente = await autosCollection.findOne({
      _id: new ObjectId(id)
    })

    if (!autoExistente) {
      return NextResponse.json(
        { error: 'Auto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si las placas ya existen en otro auto
    const autoDuplicado = await autosCollection.findOne({
      _id: { $ne: new ObjectId(id) },
      placas: placas
    })

    if (autoDuplicado) {
      return NextResponse.json(
        { error: 'Ya existe otro auto con esas placas' },
        { status: 409 }
      )
    }

    // Actualizar auto
    const autoActualizado = {
      marca,
      modelo,
      año: parseInt(año),
      placas,
      disponible: disponible !== undefined ? disponible : autoExistente.disponible,
      kilometraje: parseInt(kilometraje) || 0,
      categoria
    }

    const resultado = await autosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: autoActualizado }
    )

    if (resultado.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Auto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Auto actualizado exitosamente',
      auto: { _id: id, ...autoActualizado }
    })

  } catch (error) {
    console.error('Error actualizando auto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar auto (eliminación física)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { db } = await connectToDatabase()
    const autosCollection = db.collection('autos')

    // Verificar si el auto existe
    const autoExistente = await autosCollection.findOne({
      _id: new ObjectId(id)
    })

    if (!autoExistente) {
      return NextResponse.json(
        { error: 'Auto no encontrado' },
        { status: 404 }
      )
    }

    // Realizar eliminación física del auto
    const resultado = await autosCollection.deleteOne({
      _id: new ObjectId(id)
    })

    if (resultado.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Auto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Auto eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error eliminando auto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 