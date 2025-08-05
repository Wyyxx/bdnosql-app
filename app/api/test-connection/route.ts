import clientPromise from "@/lib/mongodb-helpers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ConAutos_DB");
    
    // Verificar que podemos acceder a la base de datos
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: "Conexión exitosa a MongoDB",
      database: "ConAutos_DB",
      collections: collections.map(col => col.name),
      collectionsCount: collections.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error de conexión:", error instanceof Error ? error.message : "Error desconocido");
    return NextResponse.json({
      success: false,
      message: "Error al conectar con MongoDB",
      error: "Error de conexión"
    }, { status: 500 });
  }
} 