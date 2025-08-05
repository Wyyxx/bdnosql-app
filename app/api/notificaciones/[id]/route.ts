import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// PATCH - Marcar notificación como leída
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { leida } = await request.json()

    console.log('📝 Marcando notificación como leída:', { id, leida })

    const { db } = await connectToDatabase()
    const notificacionesCollection = db.collection('notificaciones')

    // Verificar que la notificación existe
    const notificacionExistente = await notificacionesCollection.findOne({ 
      _id: new ObjectId(id) 
    })
    
    if (!notificacionExistente) {
      console.log('❌ Notificación no encontrada')
      return NextResponse.json(
        { error: 'La notificación especificada no existe' },
        { status: 404 }
      )
    }

    // Actualizar notificación
    const resultado = await notificacionesCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          leida: leida,
          fecha_lectura: leida ? new Date() : null
        } 
      }
    )

    if (resultado.matchedCount === 0) {
      console.log('❌ No se pudo actualizar la notificación')
      return NextResponse.json(
        { error: 'No se pudo actualizar la notificación' },
        { status: 404 }
      )
    }

    console.log('✅ Notificación actualizada exitosamente')

    return NextResponse.json({
      success: true,
      message: 'Notificación actualizada exitosamente'
    })

  } catch (error) {
    console.error('Error actualizando notificación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 