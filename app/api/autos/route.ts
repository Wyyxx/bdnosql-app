// app/api/autos/route.ts
import clientPromise from "@/lib/mongodb-helpers";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("ConAutos_DB");
  const autos = await db.collection("autos").find({}).toArray();
  return NextResponse.json(autos);
}

export async function POST(request: Request) {
  const data = await request.json();
  const client = await clientPromise;
  const db = client.db("ConAutos_DB");

  const nuevoAuto = {
    ...data,
    fechaRegistro: new Date(),
  };

  const result = await db.collection("autos").insertOne(nuevoAuto);
  return NextResponse.json({ insertedId: result.insertedId });
}
