import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const usuariosCollection = db.collection('usuarios')

    // Buscar todos los usuarios (solo para debugging)
    const usuarios = await usuariosCollection.find({}).toArray()

    // Remover contraseñas de la respuesta
    const usuariosSinContraseña = usuarios.map(usuario => {
      const { contraseña, ...usuarioSinContraseña } = usuario
      return usuarioSinContraseña
    })

    return NextResponse.json({
      success: true,
      usuarios: usuariosSinContraseña,
      total: usuarios.length
    })

  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 