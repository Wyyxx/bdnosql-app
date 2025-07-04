"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, ArrowLeft, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"

interface Rental {
  _id?: string
  clienteId: string
  clienteNombre: string
  autoId: string
  autoInfo: string
  fechaInicio: string
  fechaFin: string
  fechaDevolucionReal?: string
  precioPorDia: number
  diasRentados: number
  montoTotal: number
  estado: "activa" | "completada" | "cancelada" | "vencida"
  observaciones?: string
  fechaRegistro: string
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [availableCars, setAvailableCars] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRental, setEditingRental] = useState<Rental | null>(null)
  const [formData, setFormData] = useState<Rental>({
    clienteId: "",
    clienteNombre: "",
    autoId: "",
    autoInfo: "",
    fechaInicio: "",
    fechaFin: "",
    precioPorDia: 0,
    diasRentados: 0,
    montoTotal: 0,
    estado: "activa",
    observaciones: "",
    fechaRegistro: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadRentals()
    loadClients()
    loadAvailableCars()
  }, [])

  // TODO: Implementar carga de rentas desde MongoDB
  const loadRentals = async () => {
    // Aquí irá la lógica para cargar rentas desde MongoDB
    // Ejemplo: const rentalsData = await getRentals()

    // Datos simulados
    const mockRentals: Rental[] = [
      {
        _id: "1",
        clienteId: "1",
        clienteNombre: "Juan Pérez",
        autoId: "1",
        autoInfo: "Toyota Corolla 2022 - ABC-123",
        fechaInicio: "2024-03-01",
        fechaFin: "2024-03-05",
        precioPorDia: 800,
        diasRentados: 4,
        montoTotal: 3200,
        estado: "activa",
        observaciones: "Cliente frecuente",
        fechaRegistro: "2024-02-28",
      },
      {
        _id: "2",
        clienteId: "2",
        clienteNombre: "María González",
        autoId: "2",
        autoInfo: "Honda Civic 2023 - XYZ-789",
        fechaInicio: "2024-02-15",
        fechaFin: "2024-02-20",
        fechaDevolucionReal: "2024-02-20",
        precioPorDia: 900,
        diasRentados: 5,
        montoTotal: 4500,
        estado: "completada",
        fechaRegistro: "2024-02-14",
      },
    ]
    setRentals(mockRentals)
  }

  // TODO: Implementar carga de clientes desde MongoDB
  const loadClients = async () => {
    // Ejemplo: const clientsData = await getActiveClients()
    const mockClients = [
      { _id: "1", nombre: "Juan", apellido: "Pérez" },
      { _id: "2", nombre: "María", apellido: "González" },
    ]
    setClients(mockClients)
  }

  // TODO: Implementar carga de autos disponibles desde MongoDB
  const loadAvailableCars = async () => {
    // Ejemplo: const carsData = await getAvailableCars()
    const mockCars = [
      { _id: "1", marca: "Toyota", modelo: "Corolla", año: 2022, placas: "ABC-123", precioPorDia: 800 },
      { _id: "3", marca: "Nissan", modelo: "Sentra", año: 2023, placas: "DEF-456", precioPorDia: 750 },
    ]
    setAvailableCars(mockCars)
  }

  // Calcular días y monto total cuando cambian las fechas
  useEffect(() => {
    if (formData.fechaInicio && formData.fechaFin && formData.precioPorDia) {
      const inicio = new Date(formData.fechaInicio)
      const fin = new Date(formData.fechaFin)
      const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))

      if (dias > 0) {
        setFormData((prev) => ({
          ...prev,
          diasRentados: dias,
          montoTotal: dias * prev.precioPorDia,
        }))
      }
    }
  }, [formData.fechaInicio, formData.fechaFin, formData.precioPorDia])

  // TODO: Implementar guardado de renta en MongoDB
  const handleSaveRental = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingRental) {
      // Actualizar renta existente
      // Ejemplo: await updateRental(editingRental._id, formData)
      console.log("Actualizando renta:", formData)
    } else {
      // Crear nueva renta
      // Ejemplo: await createRental(formData)
      // También actualizar estado del auto a "rentado"
      console.log("Creando nueva renta:", formData)
    }

    await loadRentals()
    await loadAvailableCars()

    // Resetear formulario
    setFormData({
      clienteId: "",
      clienteNombre: "",
      autoId: "",
      autoInfo: "",
      fechaInicio: "",
      fechaFin: "",
      precioPorDia: 0,
      diasRentados: 0,
      montoTotal: 0,
      estado: "activa",
      observaciones: "",
      fechaRegistro: new Date().toISOString().split("T")[0],
    })
    setEditingRental(null)
    setIsDialogOpen(false)
  }

  const handleEditRental = (rental: Rental) => {
    setEditingRental(rental)
    setFormData(rental)
    setIsDialogOpen(true)
  }

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c._id === clientId)
    if (client) {
      setFormData((prev) => ({
        ...prev,
        clienteId: clientId,
        clienteNombre: `${client.nombre} ${client.apellido}`,
      }))
    }
  }

  const handleCarChange = (carId: string) => {
    const car = availableCars.find((c) => c._id === carId)
    if (car) {
      setFormData((prev) => ({
        ...prev,
        autoId: carId,
        autoInfo: `${car.marca} ${car.modelo} ${car.año} - ${car.placas}`,
        precioPorDia: car.precioPorDia,
      }))
    }
  }

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      rental.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.autoInfo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || rental.estado === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activa":
        return "default"
      case "completada":
        return "secondary"
      case "cancelada":
        return "destructive"
      case "vencida":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Rentas</h1>
              <p className="text-gray-600">Registrar y actualizar rentas de vehículos</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingRental(null)
                  setFormData({
                    clienteId: "",
                    clienteNombre: "",
                    autoId: "",
                    autoInfo: "",
                    fechaInicio: "",
                    fechaFin: "",
                    precioPorDia: 0,
                    diasRentados: 0,
                    montoTotal: 0,
                    estado: "activa",
                    observaciones: "",
                    fechaRegistro: new Date().toISOString().split("T")[0],
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Renta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingRental ? "Editar Renta" : "Nueva Renta"}</DialogTitle>
                <DialogDescription>
                  {editingRental ? "Actualiza los datos de la renta" : "Registra una nueva renta de vehículo"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveRental}>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente">Cliente</Label>
                      <Select value={formData.clienteId} onValueChange={handleClientChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client._id} value={client._id}>
                              {client.nombre} {client.apellido}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="auto">Vehículo</Label>
                      <Select value={formData.autoId} onValueChange={handleCarChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar vehículo" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCars.map((car) => (
                            <SelectItem key={car._id} value={car._id}>
                              {car.marca} {car.modelo} - {car.placas} (${car.precioPorDia}/día)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                      <Input
                        id="fechaInicio"
                        type="date"
                        value={formData.fechaInicio}
                        onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaFin">Fecha de Fin</Label>
                      <Input
                        id="fechaFin"
                        type="date"
                        value={formData.fechaFin}
                        onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="precioPorDia">Precio por Día</Label>
                      <Input
                        id="precioPorDia"
                        type="number"
                        value={formData.precioPorDia}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diasRentados">Días</Label>
                      <Input
                        id="diasRentados"
                        type="number"
                        value={formData.diasRentados}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="montoTotal">Monto Total</Label>
                      <Input
                        id="montoTotal"
                        type="number"
                        value={formData.montoTotal}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  {editingRental && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select
                          value={formData.estado}
                          onValueChange={(value: any) => setFormData({ ...formData, estado: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="activa">Activa</SelectItem>
                            <SelectItem value="completada">Completada</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                            <SelectItem value="vencida">Vencida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fechaDevolucionReal">Fecha Devolución Real</Label>
                        <Input
                          id="fechaDevolucionReal"
                          type="date"
                          value={formData.fechaDevolucionReal || ""}
                          onChange={(e) => setFormData({ ...formData, fechaDevolucionReal: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                      id="observaciones"
                      value={formData.observaciones || ""}
                      onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                      placeholder="Observaciones adicionales..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingRental ? "Actualizar" : "Crear"} Renta</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por cliente o vehículo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rentals Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Rentas ({filteredRentals.length})</CardTitle>
            <CardDescription>Gestiona todas las rentas registradas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Fechas</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Monto Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRentals.map((rental) => (
                  <TableRow key={rental._id}>
                    <TableCell className="font-medium">{rental.clienteNombre}</TableCell>
                    <TableCell>{rental.autoInfo}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(rental.fechaInicio).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500">hasta {new Date(rental.fechaFin).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>{rental.diasRentados} días</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />${rental.montoTotal}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(rental.estado) as any}>{rental.estado}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEditRental(rental)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
