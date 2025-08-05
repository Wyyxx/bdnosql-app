import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// GET - Listar rentas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cliente_id = searchParams.get('cliente_id')
    const auto_id = searchParams.get('auto_id')
    const estatus = searchParams.get('estatus')
    const search = searchParams.get('search')

    const { db } = await connectToDatabase()
    const rentasCollection = db.collection('rentas')
    const clientesCollection = db.collection('clientes')
    const autosCollection = db.collection('autos')

    // Construir filtros
    let filtro: any = {}
    
    if (cliente_id) {
      filtro.cliente_id = cliente_id
    }
    
    if (auto_id) {
      filtro.auto_id = auto_id
    }
    
    if (estatus) {
      filtro.estatus = estatus
    }

    const rentas = await rentasCollection.find(filtro).toArray()

    // Obtener información de clientes y autos para cada renta
    const rentasConInfo = await Promise.all(
      rentas.map(async (renta) => {
        try {
          console.log('🔍 Procesando renta:', renta._id)
          console.log('🔍 cliente_id:', renta.cliente_id, 'tipo:', typeof renta.cliente_id)
          console.log('🔍 auto_id:', renta.auto_id, 'tipo:', typeof renta.auto_id)
          
          let cliente = null
          let auto = null
          
          // Intentar obtener cliente
          try {
            if (renta.cliente_id) {
              const clienteId = typeof renta.cliente_id === 'string' ? new ObjectId(renta.cliente_id) : renta.cliente_id
              cliente = await clientesCollection.findOne({ _id: clienteId })
              console.log('🔍 Cliente encontrado:', cliente ? cliente.nombre : 'No encontrado')
            }
          } catch (clienteError) {
            console.error('❌ Error obteniendo cliente:', clienteError)
          }
          
          // Intentar obtener auto
          try {
            if (renta.auto_id) {
              const autoId = typeof renta.auto_id === 'string' ? new ObjectId(renta.auto_id) : renta.auto_id
              auto = await autosCollection.findOne({ _id: autoId })
              console.log('🔍 Auto encontrado:', auto ? `${auto.marca} ${auto.modelo}` : 'No encontrado')
            }
          } catch (autoError) {
            console.error('❌ Error obteniendo auto:', autoError)
          }
          
          return {
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
        } catch (error) {
          console.error('❌ Error procesando renta:', error)
          return {
            ...renta,
            cliente: null,
            auto: null
          }
        }
      })
    )

    console.log(`✅ Rentas procesadas: ${rentasConInfo.length}`)
    console.log(`📊 Rentas con cliente: ${rentasConInfo.filter(r => r.cliente).length}`)
    console.log(`📊 Rentas con auto: ${rentasConInfo.filter(r => r.auto).length}`)

    return NextResponse.json({
      success: true,
      rentas: rentasConInfo
    })

  } catch (error) {
    console.error('Error obteniendo rentas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva renta
export async function POST(request: NextRequest) {
  try {
    const { cliente_id, auto_id, fecha_inicio, fecha_fin, precio_total, estatus } = await request.json()

    console.log('🚗 Creando renta:', { cliente_id, auto_id, fecha_inicio, fecha_fin, precio_total, estatus })

    // Validaciones
    if (!cliente_id || !auto_id || !fecha_inicio || !fecha_fin || !precio_total) {
      console.log('❌ Validación fallida:', { 
        cliente_id: !!cliente_id, 
        auto_id: !!auto_id, 
        fecha_inicio: !!fecha_inicio, 
        fecha_fin: !!fecha_fin, 
        precio_total: !!precio_total 
      })
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

    // Verificar que el cliente existe
    console.log('🔍 Verificando cliente con ID:', cliente_id)
    const clienteExistente = await clientesCollection.findOne({ _id: new ObjectId(cliente_id) })
    console.log('🔍 Cliente encontrado:', clienteExistente ? 'Sí' : 'No')
    
    if (!clienteExistente) {
      console.log('❌ Cliente no encontrado')
      return NextResponse.json(
        { error: 'El cliente especificado no existe' },
        { status: 404 }
      )
    }

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

    // Verificar que el auto esté disponible
    if (!autoExistente.disponible) {
      console.log('❌ Auto no disponible')
      return NextResponse.json(
        { error: 'El auto especificado no está disponible' },
        { status: 400 }
      )
    }

    // Crear nueva renta
    const nuevaRenta = {
      cliente_id,
      auto_id,
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: new Date(fecha_fin),
      precio_total: parseFloat(precio_total),
      estatus: estatus || 'activa'
    }

    console.log('💾 Insertando renta:', nuevaRenta)
    const resultado = await rentasCollection.insertOne(nuevaRenta)
    console.log('✅ Renta creada con ID:', resultado.insertedId)

    // Actualizar disponibilidad del auto
    await autosCollection.updateOne(
      { _id: new ObjectId(auto_id) },
      { $set: { disponible: false } }
    )
    console.log('🚗 Auto marcado como no disponible')

    return NextResponse.json({
      success: true,
      message: 'Renta registrada exitosamente',
      renta: { _id: resultado.insertedId, ...nuevaRenta }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando renta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
