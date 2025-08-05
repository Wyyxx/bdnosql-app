import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import { ObjectId } from 'mongodb'

// PUT - Resolver alerta
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { resuelta } = await request.json()

    console.log('🔧 Resolviendo alerta:', { id, resuelta })

    const { db } = await connectToDatabase()
    const alertasCollection = db.collection('alertas')

    // Verificar que la alerta existe
    const alertaExistente = await alertasCollection.findOne({ _id: new ObjectId(id) })
    
    if (!alertaExistente) {
      console.log('❌ Alerta no encontrada')
      return NextResponse.json(
        { error: 'La alerta especificada no existe' },
        { status: 404 }
      )
    }

    // Actualizar alerta
    const updateData: any = { resuelta }
    
    if (resuelta) {
      updateData.fecha_resolucion = new Date()
    } else {
      updateData.fecha_resolucion = null
    }

    const resultado = await alertasCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (resultado.matchedCount === 0) {
      console.log('❌ Alerta no encontrada para actualizar')
      return NextResponse.json(
        { error: 'La alerta especificada no existe' },
        { status: 404 }
      )
    }

    console.log('✅ Alerta actualizada exitosamente')

    return NextResponse.json({
      success: true,
      message: resuelta ? 'Alerta marcada como resuelta' : 'Alerta marcada como activa'
    })

  } catch (error) {
    console.error('Error resolviendo alerta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 