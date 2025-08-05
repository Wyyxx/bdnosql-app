import clientPromise from "@/lib/mongodb-helpers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ConAutos_DB");
    const clientes = await db.collection("clientes").find({}).toArray();

    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return new NextResponse("Error en la conexión", { status: 500 });
  }
}
