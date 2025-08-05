import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// GET - Listar notificaciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuario_id = searchParams.get('usuario_id')
    const usuario_email = searchParams.get('usuario_email')
    const leida = searchParams.get('leida')

    const { db } = await connectToDatabase()
    const notificacionesCollection = db.collection('notificaciones')
    const usuariosCollection = db.collection('usuarios')

    // Construir filtros
    let filtro: any = {}
    
    if (usuario_id) {
      filtro.usuario_id = usuario_id
    } else if (usuario_email) {
      // Buscar usuario por email y obtener su ID
      const usuario = await usuariosCollection.findOne({ correo: usuario_email })
      if (usuario) {
        filtro.usuario_id = usuario._id.toString()
      }
    }
    
    if (leida !== null) {
      filtro.leida = leida === 'true'
    }

    const notificaciones = await notificacionesCollection
      .find(filtro)
      .sort({ fecha_creacion: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      notificaciones
    })

  } catch (error) {
    console.error('Error obteniendo notificaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva notificación
export async function POST(request: NextRequest) {
  try {
    const { 
      usuario_id, 
      titulo, 
      mensaje, 
      tipo, 
      datos_adicionales 
    } = await request.json()

    console.log('🔔 Creando notificación:', { 
      usuario_id, 
      titulo, 
      mensaje, 
      tipo 
    })

    // Validaciones
    if (!usuario_id || !titulo || !mensaje || !tipo) {
      console.log('❌ Validación fallida:', { 
        usuario_id: !!usuario_id, 
        titulo: !!titulo, 
        mensaje: !!mensaje, 
        tipo: !!tipo 
      })
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const notificacionesCollection = db.collection('notificaciones')
    const usuariosCollection = db.collection('usuarios')

    // Verificar que el usuario existe
    console.log('🔍 Verificando usuario con ID:', usuario_id)
    const usuarioExistente = await usuariosCollection.findOne({ _id: new ObjectId(usuario_id) })
    console.log('🔍 Usuario encontrado:', usuarioExistente ? 'Sí' : 'No')
    
    if (!usuarioExistente) {
      console.log('❌ Usuario no encontrado')
      return NextResponse.json(
        { error: 'El usuario especificado no existe' },
        { status: 404 }
      )
    }

    // Crear nueva notificación
    const nuevaNotificacion = {
      usuario_id,
      titulo,
      mensaje,
      tipo,
      datos_adicionales: datos_adicionales || {},
      leida: false,
      fecha_creacion: new Date()
    }

    console.log('💾 Insertando notificación:', nuevaNotificacion)
    const resultado = await notificacionesCollection.insertOne(nuevaNotificacion)
    console.log('✅ Notificación creada con ID:', resultado.insertedId)

    return NextResponse.json({
      success: true,
      message: 'Notificación creada exitosamente',
      notificacion: { _id: resultado.insertedId, ...nuevaNotificacion }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando notificación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 