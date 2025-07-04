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
import { Plus, Search, Edit, ArrowLeft, DollarSign } from "lucide-react"
import Link from "next/link"

interface Repair {
  _id?: string
  autoId: string
  autoInfo: string
  tipoReparacion: string
  descripcion: string
  costo: number
  fechaInicio: string
  fechaFinalizacion?: string
  estado: "pendiente" | "en_proceso" | "completada" | "cancelada"
  taller?: string
  tecnico?: string
  observaciones?: string
  fechaRegistro: string
}

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [cars, setCars] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRepair, setEditingRepair] = useState<Repair | null>(null)
  const [formData, setFormData] = useState<Repair>({
    autoId: "",
    autoInfo: "",
    tipoReparacion: "",
    descripcion: "",
    costo: 0,
    fechaInicio: new Date().toISOString().split("T")[0],
    estado: "pendiente",
    taller: "",
    tecnico: "",
    observaciones: "",
    fechaRegistro: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadRepairs()
    loadCars()
  }, [])

  // TODO: Implementar carga de reparaciones desde MongoDB
  const loadRepairs = async () => {
    // Aquí irá la lógica para cargar reparaciones desde MongoDB
    // Ejemplo: const repairsData = await getRepairs()

    // Datos simulados
    const mockRepairs: Repair[] = [
      {
        _id: "1",
        autoId: "1",
        autoInfo: "Toyota Corolla 2022 - ABC-123",
        tipoReparacion: "Mantenimiento preventivo",
        descripcion: "Cambio de aceite y filtros",
        costo: 1500,
        fechaInicio: "2024-03-01",
        fechaFinalizacion: "2024-03-02",
        estado: "completada",
        taller: "Taller Central",
        tecnico: "Carlos Méndez",
        observaciones: "Servicio completo realizado",
        fechaRegistro: "2024-02-28",
      },
      {
        _id: "2",
        autoId: "2",
        autoInfo: "Honda Civic 2023 - XYZ-789",
        tipoReparacion: "Reparación mayor",
        descripcion: "Reparación de transmisión",
        costo: 8500,
        fechaInicio: "2024-03-05",
        estado: "en_proceso",
        taller: "Taller Especializado",
        tecnico: "Ana López",
        fechaRegistro: "2024-03-04",
      },
    ]
    setRepairs(mockRepairs)
  }

  // TODO: Implementar carga de autos desde MongoDB
  const loadCars = async () => {
    // Ejemplo: const carsData = await getAllCars()
    const mockCars = [
      { _id: "1", marca: "Toyota", modelo: "Corolla", año: 2022, placas: "ABC-123" },
      { _id: "2", marca: "Honda", modelo: "Civic", año: 2023, placas: "XYZ-789" },
      { _id: "3", marca: "Nissan", modelo: "Sentra", año: 2023, placas: "DEF-456" },
    ]
    setCars(mockCars)
  }

  // TODO: Implementar guardado de reparación en MongoDB
  const handleSaveRepair = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingRepair) {
      // Actualizar reparación existente
      // Ejemplo: await updateRepair(editingRepair._id, formData)
      console.log("Actualizando reparación:", formData)
    } else {
      // Crear nueva reparación
      // Ejemplo: await createRepair(formData)
      // También actualizar estado del auto si es necesario
      console.log("Creando nueva reparación:", formData)
    }

    await loadRepairs()

    // Resetear formulario
    setFormData({
      autoId: "",
      autoInfo: "",
      tipoReparacion: "",
      descripcion: "",
      costo: 0,
      fechaInicio: new Date().toISOString().split("T")[0],
      estado: "pendiente",
      taller: "",
      tecnico: "",
      observaciones: "",
      fechaRegistro: new Date().toISOString().split("T")[0],
    })
    setEditingRepair(null)
    setIsDialogOpen(false)
  }

  const handleEditRepair = (repair: Repair) => {
    setEditingRepair(repair)
    setFormData(repair)
    setIsDialogOpen(true)
  }

  const handleCarChange = (carId: string) => {
    const car = cars.find((c) => c._id === carId)
    if (car) {
      setFormData((prev) => ({
        ...prev,
        autoId: carId,
        autoInfo: `${car.marca} ${car.modelo} ${car.año} - ${car.placas}`,
      }))
    }
  }

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch =
      repair.autoInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.tipoReparacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repair.taller && repair.taller.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (repair.tecnico && repair.tecnico.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter = filterStatus === "all" || repair.estado === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "secondary"
      case "en_proceso":
        return "default"
      case "completada":
        return "outline"
      case "cancelada":
        return "destructive"
      default:
        return "default"
    }
  }

  const tiposReparacion = [
    "Mantenimiento preventivo",
    "Reparación menor",
    "Reparación mayor",
    "Cambio de llantas",
    "Reparación de motor",
    "Reparación de transmisión",
    "Sistema eléctrico",
    "Sistema de frenos",
    "Aire acondicionado",
    "Otro",
  ]

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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Reparaciones</h1>
              <p className="text-gray-600">Registrar reparaciones de vehículos</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingRepair(null)
                  setFormData({
                    autoId: "",
                    autoInfo: "",
                    tipoReparacion: "",
                    descripcion: "",
                    costo: 0,
                    fechaInicio: new Date().toISOString().split("T")[0],
                    estado: "pendiente",
                    taller: "",
                    tecnico: "",
                    observaciones: "",
                    fechaRegistro: new Date().toISOString().split("T")[0],
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Reparación
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingRepair ? "Editar Reparación" : "Nueva Reparación"}</DialogTitle>
                <DialogDescription>
                  {editingRepair ? "Actualiza los datos de la reparación" : "Registra una nueva reparación de vehículo"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveRepair}>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="auto">Vehículo</Label>
                    <Select value={formData.autoId} onValueChange={handleCarChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {cars.map((car) => (
                          <SelectItem key={car._id} value={car._id}>
                            {car.marca} {car.modelo} {car.año} - {car.placas}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoReparacion">Tipo de Reparación</Label>
                      <Select
                        value={formData.tipoReparacion}
                        onValueChange={(value) => setFormData({ ...formData, tipoReparacion: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposReparacion.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="costo">Costo ($)</Label>
                      <Input
                        id="costo"
                        type="number"
                        step="0.01"
                        value={formData.costo}
                        onChange={(e) => setFormData({ ...formData, costo: Number.parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Describe detalladamente la reparación..."
                      required
                    />
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
                      <Label htmlFor="fechaFinalizacion">Fecha de Finalización</Label>
                      <Input
                        id="fechaFinalizacion"
                        type="date"
                        value={formData.fechaFinalizacion || ""}
                        onChange={(e) => setFormData({ ...formData, fechaFinalizacion: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taller">Taller</Label>
                      <Input
                        id="taller"
                        value={formData.taller || ""}
                        onChange={(e) => setFormData({ ...formData, taller: e.target.value })}
                        placeholder="Nombre del taller"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tecnico">Técnico</Label>
                      <Input
                        id="tecnico"
                        value={formData.tecnico || ""}
                        onChange={(e) => setFormData({ ...formData, tecnico: e.target.value })}
                        placeholder="Nombre del técnico"
                      />
                    </div>
                  </div>

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
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="en_proceso">En Proceso</SelectItem>
                        <SelectItem value="completada">Completada</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                  <Button type="submit">{editingRepair ? "Actualizar" : "Crear"} Reparación</Button>
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
                placeholder="Buscar por vehículo, tipo, taller o técnico..."
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
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Repairs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Reparaciones ({filteredRepairs.length})</CardTitle>
            <CardDescription>Gestiona todas las reparaciones registradas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Tipo de Reparación</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>Fechas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepairs.map((repair) => (
                  <TableRow key={repair._id}>
                    <TableCell className="font-medium">{repair.autoInfo}</TableCell>
                    <TableCell>{repair.tipoReparacion}</TableCell>
                    <TableCell className="max-w-xs truncate">{repair.descripcion}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />${repair.costo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Inicio: {new Date(repair.fechaInicio).toLocaleDateString()}</div>
                        {repair.fechaFinalizacion && (
                          <div className="text-gray-500">
                            Fin: {new Date(repair.fechaFinalizacion).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(repair.estado) as any}>{repair.estado.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEditRepair(repair)}>
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
