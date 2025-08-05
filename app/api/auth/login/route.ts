import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { correo, contraseña } = await request.json()

    console.log('🔍 Intento de login:', { correo, contraseña: contraseña ? '***' : 'undefined' })

    if (!correo || !contraseña) {
      console.log('❌ Datos faltantes:', { correo: !!correo, contraseña: !!contraseña })
      return NextResponse.json(
        { error: 'Correo y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const usuariosCollection = db.collection('usuarios')

    // Buscar usuario por correo
    const usuario = await usuariosCollection.findOne({ 
      correo: correo,
      activo: true 
    })

    console.log('🔍 Usuario encontrado:', usuario ? 'Sí' : 'No')

    if (!usuario) {
      console.log('❌ Usuario no encontrado o inactivo')
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const contraseñaValida = usuario.contraseña === contraseña
    console.log('🔍 Verificación de contraseña:', contraseñaValida ? 'Correcta' : 'Incorrecta')

    if (!contraseñaValida) {
      console.log('❌ Contraseña incorrecta')
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Crear respuesta exitosa sin exponer la contraseña
    const { contraseña: _, ...usuarioSinContraseña } = usuario

    console.log('✅ Login exitoso para:', usuario.nombre)

    return NextResponse.json({
      success: true,
      usuario: usuarioSinContraseña,
      message: 'Login exitoso'
    })

  } catch (error) {
    console.error('❌ Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 