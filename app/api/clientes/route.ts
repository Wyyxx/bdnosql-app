import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'

// GET - Listar clientes
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const clientesCollection = db.collection('clientes')

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const activo = searchParams.get('activo')
    const search = searchParams.get('search')

    // Construir filtro
    let filter: any = {}
    
    if (activo !== null) {
      filter.activo = activo === 'true'
    }
    
    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { correo: { $regex: search, $options: 'i' } },
        { telefono: { $regex: search, $options: 'i' } }
      ]
    }

    const clientes = await clientesCollection.find(filter).toArray()

    return NextResponse.json({
      success: true,
      clientes,
      total: clientes.length
    })

  } catch (error) {
    console.error('Error obteniendo clientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const { nombre, telefono, correo, direccion } = await request.json()

    // Validaciones
    if (!nombre || !telefono || !correo || !direccion) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const clientesCollection = db.collection('clientes')

    // Verificar si el cliente ya existe (por correo o teléfono)
    const clienteExistente = await clientesCollection.findOne({
      $or: [
        { correo: correo },
        { telefono: telefono }
      ]
    })

    if (clienteExistente) {
      return NextResponse.json(
        { error: 'Ya existe un cliente con ese correo o teléfono' },
        { status: 409 }
      )
    }

    // Crear nuevo cliente
    const nuevoCliente = {
      nombre,
      telefono,
      correo,
      direccion,
      activo: true,
      fecha_registro: new Date()
    }

    const resultado = await clientesCollection.insertOne(nuevoCliente)

    return NextResponse.json({
      success: true,
      cliente: { _id: resultado.insertedId, ...nuevoCliente },
      message: 'Cliente registrado exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando cliente:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
