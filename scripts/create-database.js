// TODO: Script para crear la base de datos y colecciones iniciales
// Este script se ejecutará para configurar la base de datos MongoDB

/*
Estructura de colecciones sugerida:

1. users - Usuarios del sistema
{
  _id: ObjectId,
  username: String,
  password: String (hasheada),
  role: String, // 'empleado', 'encargado', 'dueno'
  nombre: String,
  email: String,
  fechaCreacion: Date,
  estado: String // 'activo', 'inactivo'
}

2. clients - Clientes
{
  _id: ObjectId,
  nombre: String,
  apellido: String,
  email: String,
  telefono: String,
  direccion: String,
  licencia: String,
  fechaRegistro: Date,
  estado: String // 'activo', 'inactivo'
}

3. cars - Autos
{
  _id: ObjectId,
  marca: String,
  modelo: String,
  año: Number,
  color: String,
  placas: String,
  numeroSerie: String,
  precioPorDia: Number,
  estado: String, // 'disponible', 'rentado', 'mantenimiento', 'fuera_servicio'
  fechaRegistro: Date,
  kilometraje: Number,
  combustible: String, // 'gasolina', 'diesel', 'electrico', 'hibrido'
  transmision: String, // 'manual', 'automatica'
  categoria: String // 'economico', 'compacto', 'intermedio', 'lujo', 'suv'
}

4. rentals - Rentas
{
  _id: ObjectId,
  clienteId: ObjectId,
  autoId: ObjectId,
  fechaInicio: Date,
  fechaFin: Date,
  fechaDevolucionReal: Date,
  precioPorDia: Number,
  diasRentados: Number,
  montoTotal: Number,
  estado: String, // 'activa', 'completada', 'cancelada', 'vencida'
  observaciones: String,
  fechaRegistro: Date
}

5. repairs - Reparaciones
{
  _id: ObjectId,
  autoId: ObjectId,
  tipoReparacion: String,
  descripcion: String,
  costo: Number,
  fechaInicio: Date,
  fechaFinalizacion: Date,
  estado: String, // 'pendiente', 'en_proceso', 'completada', 'cancelada'
  taller: String,
  tecnico: String,
  observaciones: String,
  fechaRegistro: Date
}

6. returns - Devoluciones
{
  _id: ObjectId,
  rentalId: ObjectId,
  autoId: ObjectId,
  fechaDevolucion: Date,
  estadoVehiculo: String, // 'bueno', 'regular', 'malo'
  kilometrajeDevolucion: Number,
  danosReportados: String,
  multasPendientes: Number,
  observaciones: String,
  fechaRegistro: Date
}

7. alerts - Alertas
{
  _id: ObjectId,
  tipo: String, // 'vehiculo_mal_estado', 'renta_vencida', etc.
  autoId: ObjectId,
  rentalId: ObjectId,
  mensaje: String,
  estado: String, // 'activa', 'resuelta'
  fechaCreacion: Date,
  fechaResolucion: Date
}

Índices sugeridos:
- clients: { email: 1 }, { licencia: 1 }
- cars: { placas: 1 }, { numeroSerie: 1 }, { estado: 1 }
- rentals: { clienteId: 1 }, { autoId: 1 }, { estado: 1 }, { fechaInicio: 1, fechaFin: 1 }
- repairs: { autoId: 1 }, { fechaInicio: 1 }, { estado: 1 }
- returns: { rentalId: 1 }, { autoId: 1 }
- alerts: { estado: 1 }, { tipo: 1 }
*/

console.log("Para crear la base de datos, ejecuta este script con Node.js después de configurar MongoDB")
console.log("Ejemplo de uso:")
console.log("1. Instala MongoDB y configura la conexión")
console.log("2. Actualiza la cadena de conexión en las variables de entorno")
console.log("3. Ejecuta: node scripts/create-database.js")
