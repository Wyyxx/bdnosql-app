import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// GET - Obtener renta específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { db } = await connectToDatabase()
    const rentasCollection = db.collection('rentas')
    const clientesCollection = db.collection('clientes')
    const autosCollection = db.collection('autos')

    const renta = await rentasCollection.findOne({ _id: new ObjectId(id) })

    if (!renta) {
      return NextResponse.json(
        { error: 'Renta no encontrada' },
        { status: 404 }
      )
    }

    // Obtener información del cliente y auto
    const cliente = await clientesCollection.findOne({ _id: new ObjectId(renta.cliente_id) })
    const auto = await autosCollection.findOne({ _id: new ObjectId(renta.auto_id) })

    const rentaConInfo = {
      ...renta,
      cliente: cliente ? {
        nombre: cliente.nombre,
        correo: cliente.correo,
        telefono: cliente.telefono
      } : null,
      auto: auto ? {
        marca: auto.marca,
        modelo: auto.modelo,
        placas: auto.placas,
        categoria: auto.categoria
      } : null
    }

    return NextResponse.json({
      success: true,
      renta: rentaConInfo
    })

  } catch (error) {
    console.error('Error obteniendo renta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar renta
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { cliente_id, auto_id, fecha_inicio, fecha_fin, precio_total, estatus } = await request.json()

    console.log('🔄 Actualizando renta:', { id, cliente_id, auto_id, fecha_inicio, fecha_fin, precio_total, estatus })

    // Validaciones
    if (!cliente_id || !auto_id || !fecha_inicio || !fecha_fin || !precio_total) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Validar precio
    if (precio_total <= 0) {
      return NextResponse.json(
        { error: 'El precio total debe ser mayor a 0' },
        { status: 400 }
      )
    }

    // Validar fechas
    const fechaInicio = new Date(fecha_inicio)
    const fechaFin = new Date(fecha_fin)
    
    if (fechaInicio >= fechaFin) {
      return NextResponse.json(
        { error: 'La fecha de fin debe ser posterior a la fecha de inicio' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const rentasCollection = db.collection('rentas')
    const clientesCollection = db.collection('clientes')
    const autosCollection = db.collection('autos')

    // Verificar que la renta existe
    const rentaExistente = await rentasCollection.findOne({ _id: new ObjectId(id) })
    if (!rentaExistente) {
      return NextResponse.json(
        { error: 'Renta no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que el cliente existe
    const clienteExistente = await clientesCollection.findOne({ _id: new ObjectId(cliente_id) })
    if (!clienteExistente) {
      return NextResponse.json(
        { error: 'El cliente especificado no existe' },
        { status: 404 }
      )
    }

    // Verificar que el auto existe
    const autoExistente = await autosCollection.findOne({ _id: new ObjectId(auto_id) })
    if (!autoExistente) {
      return NextResponse.json(
        { error: 'El auto especificado no existe' },
        { status: 404 }
      )
    }

    // Si se cambia el auto, verificar disponibilidad
    if (rentaExistente.auto_id !== auto_id) {
      if (!autoExistente.disponible) {
        return NextResponse.json(
          { error: 'El auto especificado no está disponible' },
          { status: 400 }
        )
      }

      // Marcar el auto anterior como disponible
      await autosCollection.updateOne(
        { _id: new ObjectId(rentaExistente.auto_id) },
        { $set: { disponible: true } }
      )

      // Marcar el nuevo auto como no disponible
      await autosCollection.updateOne(
        { _id: new ObjectId(auto_id) },
        { $set: { disponible: false } }
      )
    }

    // Actualizar renta
    const rentaActualizada = {
      cliente_id,
      auto_id,
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: new Date(fecha_fin),
      precio_total: parseFloat(precio_total),
      estatus: estatus || rentaExistente.estatus
    }

    const resultado = await rentasCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: rentaActualizada }
    )

    if (resultado.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Renta no encontrada' },
        { status: 404 }
      )
    }

    console.log('✅ Renta actualizada exitosamente')

    return NextResponse.json({
      success: true,
      message: 'Renta actualizada exitosamente',
      renta: { _id: id, ...rentaActualizada }
    })

  } catch (error) {
    console.error('Error actualizando renta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 