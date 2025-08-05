import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// GET - Listar devoluciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const auto_id = searchParams.get('auto_id')
    const estatus = searchParams.get('estatus')
    const search = searchParams.get('search')

    const { db } = await connectToDatabase()
    const devolucionesCollection = db.collection('devoluciones')
    const autosCollection = db.collection('autos')
    const rentasCollection = db.collection('rentas')

    // Construir filtros
    let filtro: any = {}
    
    if (auto_id) {
      filtro.auto_id = auto_id
    }
    
    if (estatus) {
      filtro.estado_vehiculo = estatus
    }

    const devoluciones = await devolucionesCollection.find(filtro).toArray()

    // Obtener información de autos y rentas para cada devolución
    const devolucionesConInfo = await Promise.all(
      devoluciones.map(async (devolucion) => {
        try {
          let auto = null
          let renta = null
          
          // Obtener información del auto
          try {
            if (devolucion.auto_id) {
              const autoId = typeof devolucion.auto_id === 'string' ? new ObjectId(devolucion.auto_id) : devolucion.auto_id
              auto = await autosCollection.findOne({ _id: autoId })
            }
          } catch (error) {
            console.error('Error obteniendo auto:', error)
          }
          
          // Obtener información de la renta
          try {
            if (devolucion.renta_id) {
              const rentaId = typeof devolucion.renta_id === 'string' ? new ObjectId(devolucion.renta_id) : devolucion.renta_id
              renta = await rentasCollection.findOne({ _id: rentaId })
            }
          } catch (error) {
            console.error('Error obteniendo renta:', error)
          }
          
          return {
            ...devolucion,
            auto: auto ? {
              marca: auto.marca,
              modelo: auto.modelo,
              placas: auto.placas,
              categoria: auto.categoria
            } : null,
            renta: renta ? {
              fecha_inicio: renta.fecha_inicio,
              fecha_fin: renta.fecha_fin,
              precio_total: renta.precio_total
            } : null
          }
        } catch (error) {
          console.error('Error procesando devolución:', error)
          return {
            ...devolucion,
            auto: null,
            renta: null
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      devoluciones: devolucionesConInfo
    })

  } catch (error) {
    console.error('Error obteniendo devoluciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva devolución
export async function POST(request: NextRequest) {
  try {
    const { 
      renta_id, 
      auto_id, 
      fecha_devolucion, 
      estado_vehiculo, 
      observaciones, 
      recibido_por 
    } = await request.json()

    console.log('🚗 Creando devolución:', { 
      renta_id, 
      auto_id, 
      fecha_devolucion, 
      estado_vehiculo, 
      recibido_por 
    })

    // Validaciones
    if (!renta_id || !auto_id || !fecha_devolucion || !estado_vehiculo || !recibido_por) {
      console.log('❌ Validación fallida:', { 
        renta_id: !!renta_id, 
        auto_id: !!auto_id, 
        fecha_devolucion: !!fecha_devolucion, 
        estado_vehiculo: !!estado_vehiculo, 
        recibido_por: !!recibido_por 
      })
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const devolucionesCollection = db.collection('devoluciones')
    const rentasCollection = db.collection('rentas')
    const autosCollection = db.collection('autos')

    // Verificar que la renta existe
    console.log('🔍 Verificando renta con ID:', renta_id)
    const rentaExistente = await rentasCollection.findOne({ _id: new ObjectId(renta_id) })
    console.log('🔍 Renta encontrada:', rentaExistente ? 'Sí' : 'No')
    
    if (!rentaExistente) {
      console.log('❌ Renta no encontrada')
      return NextResponse.json(
        { error: 'La renta especificada no existe' },
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

    // Crear nueva devolución
    const nuevaDevolucion = {
      renta_id,
      auto_id,
      fecha_devolucion: new Date(fecha_devolucion),
      estado_vehiculo,
      observaciones: observaciones || '',
      recibido_por,
      fecha_registro: new Date()
    }

    console.log('💾 Insertando devolución:', nuevaDevolucion)
    const resultado = await devolucionesCollection.insertOne(nuevaDevolucion)
    console.log('✅ Devolución creada con ID:', resultado.insertedId)

    // Actualizar disponibilidad del auto
    await autosCollection.updateOne(
      { _id: new ObjectId(auto_id) },
      { $set: { disponible: true } }
    )
    console.log('🚗 Auto marcado como disponible')

    // Actualizar estatus de la renta
    await rentasCollection.updateOne(
      { _id: new ObjectId(renta_id) },
      { $set: { estatus: 'finalizada' } }
    )
    console.log('📋 Renta marcada como finalizada')

    // Crear alerta si el vehículo está en mal estado
    if (estado_vehiculo === 'malo' || estado_vehiculo === 'regular') {
      console.log('🚨 Vehículo devuelto en mal estado, creando alerta...')
      
      const alertasCollection = db.collection('alertas')
      const notificacionesCollection = db.collection('notificaciones')
      const usuariosCollection = db.collection('usuarios')
      
      const mensajeAlerta = estado_vehiculo === 'malo' 
        ? `Vehículo devuelto en MAL ESTADO: ${observaciones || 'Sin observaciones específicas'}`
        : `Vehículo devuelto en estado REGULAR: ${observaciones || 'Requiere revisión'}`
      
      const nuevaAlerta = {
        auto_id,
        tipo: 'vehiculo_mal_estado',
        mensaje: mensajeAlerta,
        severidad: estado_vehiculo === 'malo' ? 'alta' : 'media',
        creada_por: recibido_por,
        resuelta: false,
        fecha_creacion: new Date(),
        fecha_resolucion: null
      }
      
      await alertasCollection.insertOne(nuevaAlerta)
      console.log('✅ Alerta creada para vehículo en mal estado')
      
      // Crear notificaciones para empleados
      try {
        const empleados = await usuariosCollection.find({ rol: 'empleado' }).toArray()
        
        for (const empleado of empleados) {
          const tituloNotificacion = estado_vehiculo === 'malo' 
            ? '🚨 Vehículo Devuelto en Mal Estado'
            : '⚠️ Vehículo Devuelto en Estado Regular'
          
          const mensajeNotificacion = `El vehículo ${autoExistente.marca} ${autoExistente.modelo} (${autoExistente.placas}) ha sido devuelto en estado ${estado_vehiculo}. ${observaciones || 'Sin observaciones específicas'}`
          
          const nuevaNotificacion = {
            usuario_id: empleado._id.toString(),
            titulo: tituloNotificacion,
            mensaje: mensajeNotificacion,
            tipo: 'devolucion_alerta',
            datos_adicionales: {
              auto_id: auto_id,
              estado_vehiculo: estado_vehiculo,
              devolucion_id: resultado.insertedId.toString(),
              observaciones: observaciones
            },
            leida: false,
            fecha_creacion: new Date()
          }
          
          await notificacionesCollection.insertOne(nuevaNotificacion)
          console.log(`🔔 Notificación enviada a empleado: ${empleado.nombre}`)
        }
        
        console.log(`✅ ${empleados.length} notificaciones enviadas a empleados`)
      } catch (error) {
        console.error('❌ Error enviando notificaciones a empleados:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Devolución registrada exitosamente',
      devolucion: { _id: resultado.insertedId, ...nuevaDevolucion }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando devolución:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 