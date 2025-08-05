import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// GET - Obtener cliente específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { db } = await connectToDatabase()
    const clientesCollection = db.collection('clientes')

    const cliente = await clientesCollection.findOne({
      _id: new ObjectId(id)
    })

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      cliente
    })

  } catch (error) {
    console.error('Error obteniendo cliente:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { nombre, telefono, correo, direccion, activo } = await request.json()

    // Validaciones
    if (!nombre || !telefono || !correo || !direccion) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const clientesCollection = db.collection('clientes')

    // Verificar si el cliente existe
    const clienteExistente = await clientesCollection.findOne({
      _id: new ObjectId(id)
    })

    if (!clienteExistente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si el correo o teléfono ya existe en otro cliente
    const clienteDuplicado = await clientesCollection.findOne({
      _id: { $ne: new ObjectId(id) },
      $or: [
        { correo: correo },
        { telefono: telefono }
      ]
    })

    if (clienteDuplicado) {
      return NextResponse.json(
        { error: 'Ya existe otro cliente con ese correo o teléfono' },
        { status: 409 }
      )
    }

    // Actualizar cliente
    const clienteActualizado = {
      nombre,
      telefono,
      correo,
      direccion,
      activo: activo !== undefined ? activo : clienteExistente.activo
    }

    const resultado = await clientesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: clienteActualizado }
    )

    if (resultado.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      cliente: { _id: id, ...clienteActualizado }
    })

  } catch (error) {
    console.error('Error actualizando cliente:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar cliente (baja lógica)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { db } = await connectToDatabase()
    const clientesCollection = db.collection('clientes')

    // Verificar si el cliente existe
    const clienteExistente = await clientesCollection.findOne({
      _id: new ObjectId(id)
    })

    if (!clienteExistente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Realizar eliminación física del cliente
    const resultado = await clientesCollection.deleteOne({
      _id: new ObjectId(id)
    })

    if (resultado.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error eliminando cliente:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 