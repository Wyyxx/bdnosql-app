import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-helpers'

// GET - Listar autos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const disponible = searchParams.get('disponible')
    const search = searchParams.get('search')

    const { db } = await connectToDatabase()
    const autosCollection = db.collection('autos')

    // Construir filtros
    let filtro: any = {}
    
    if (disponible !== null && disponible !== 'all') {
      filtro.disponible = disponible === 'true'
    }
    
    if (search) {
      filtro.$or = [
        { marca: { $regex: search, $options: 'i' } },
        { modelo: { $regex: search, $options: 'i' } },
        { placas: { $regex: search, $options: 'i' } },
        { categoria: { $regex: search, $options: 'i' } }
      ]
    }

    const autos = await autosCollection.find(filtro).toArray()

    return NextResponse.json({
      success: true,
      autos
    })

  } catch (error) {
    console.error('Error obteniendo autos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo auto
export async function POST(request: NextRequest) {
  try {
    const { marca, modelo, año, placas, disponible, kilometraje, categoria } = await request.json()

    // Validaciones
    if (!marca || !modelo || !año || !placas || !categoria) {
      return NextResponse.json(
        { error: 'Marca, modelo, año, placas y categoría son requeridos' },
        { status: 400 }
      )
    }

    // Validar año
    if (año < 1900 || año > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { error: 'Año inválido' },
        { status: 400 }
      )
    }

    // Validar kilometraje
    if (kilometraje < 0) {
      return NextResponse.json(
        { error: 'Kilometraje no puede ser negativo' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const autosCollection = db.collection('autos')

    // Verificar si las placas ya existen
    const autoExistente = await autosCollection.findOne({ placas: placas })

    if (autoExistente) {
      return NextResponse.json(
        { error: 'Ya existe un auto con esas placas' },
        { status: 409 }
      )
    }

    // Crear nuevo auto
    const nuevoAuto = {
      marca,
      modelo,
      año: parseInt(año),
      placas,
      disponible: disponible !== undefined ? disponible : true,
      kilometraje: parseInt(kilometraje) || 0,
      categoria,
      fecha_ingreso: new Date()
    }

    const resultado = await autosCollection.insertOne(nuevoAuto)

    return NextResponse.json({
      success: true,
      message: 'Auto registrado exitosamente',
      auto: { _id: resultado.insertedId, ...nuevoAuto }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando auto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
