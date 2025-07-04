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
import { Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Car {
  _id?: string
  marca: string
  modelo: string
  año: number
  color: string
  placas: string
  numeroSerie: string
  precioPorDia: number
  estado: "disponible" | "rentado" | "mantenimiento" | "fuera_servicio"
  fechaRegistro: string
  kilometraje: number
  combustible: "gasolina" | "diesel" | "electrico" | "hibrido"
  transmision: "manual" | "automatica"
  categoria: "economico" | "compacto" | "intermedio" | "lujo" | "suv"
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [formData, setFormData] = useState<Car>({
    marca: "",
    modelo: "",
    año: new Date().getFullYear(),
    color: "",
    placas: "",
    numeroSerie: "",
    precioPorDia: 0,
    estado: "disponible",
    fechaRegistro: new Date().toISOString().split("T")[0],
    kilometraje: 0,
    combustible: "gasolina",
    transmision: "manual",
    categoria: "economico",
  })

  useEffect(() => {
    loadCars()
  }, [])

  // TODO: Implementar carga de autos desde MongoDB
  const loadCars = async () => {
    // Aquí irá la lógica para cargar autos desde MongoDB
    // Ejemplo: const carsData = await getCars()

    // Datos simulados
    const mockCars: Car[] = [
      {
        _id: "1",
        marca: "Toyota",
        modelo: "Corolla",
        año: 2022,
        color: "Blanco",
        placas: "ABC-123",
        numeroSerie: "TOY123456789",
        precioPorDia: 800,
        estado: "disponible",
        fechaRegistro: "2024-01-15",
        kilometraje: 15000,
        combustible: "gasolina",
        transmision: "automatica",
        categoria: "compacto",
      },
      {
        _id: "2",
        marca: "Honda",
        modelo: "Civic",
        año: 2023,
        color: "Negro",
        placas: "XYZ-789",
        numeroSerie: "HON987654321",
        precioPorDia: 900,
        estado: "rentado",
        fechaRegistro: "2024-02-20",
        kilometraje: 8000,
        combustible: "gasolina",
        transmision: "manual",
        categoria: "compacto",
      },
    ]
    setCars(mockCars)
  }

  // TODO: Implementar guardado de auto en MongoDB
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCar) {
      // Actualizar auto existente
      // Ejemplo: await updateCar(editingCar._id, formData)
      console.log("Actualizando auto:", formData)
    } else {
      // Crear nuevo auto
      // Ejemplo: await createCar(formData)
      console.log("Creando nuevo auto:", formData)
    }

    // Recargar lista de autos
    await loadCars()

    // Resetear formulario
    setFormData({
      marca: "",
      modelo: "",
      año: new Date().getFullYear(),
      color: "",
      placas: "",
      numeroSerie: "",
      precioPorDia: 0,
      estado: "disponible",
      fechaRegistro: new Date().toISOString().split("T")[0],
      kilometraje: 0,
      combustible: "gasolina",
      transmision: "manual",
      categoria: "economico",
    })
    setEditingCar(null)
    setIsDialogOpen(false)
  }

  // TODO: Implementar eliminación de auto en MongoDB
  const handleDeleteCar = async (carId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este auto?")) {
      // Ejemplo: await deleteCar(carId)
      console.log("Eliminando auto:", carId)
      await loadCars()
    }
  }

  const handleEditCar = (car: Car) => {
    setEditingCar(car)
    setFormData(car)
    setIsDialogOpen(true)
  }

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.placas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || car.estado === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponible":
        return "default"
      case "rentado":
        return "destructive"
      case "mantenimiento":
        return "secondary"
      case "fuera_servicio":
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Autos</h1>
              <p className="text-gray-600">Registrar y mantener datos de vehículos</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingCar(null)
                  setFormData({
                    marca: "",
                    modelo: "",
                    año: new Date().getFullYear(),
                    color: "",
                    placas: "",
                    numeroSerie: "",
                    precioPorDia: 0,
                    estado: "disponible",
                    fechaRegistro: new Date().toISOString().split("T")[0],
                    kilometraje: 0,
                    combustible: "gasolina",
                    transmision: "manual",
                    categoria: "economico",
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Auto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingCar ? "Editar Auto" : "Nuevo Auto"}</DialogTitle>
                <DialogDescription>
                  {editingCar ? "Actualiza los datos del vehículo" : "Ingresa los datos del nuevo vehículo"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveCar}>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="marca">Marca</Label>
                      <Input
                        id="marca"
                        value={formData.marca}
                        onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modelo">Modelo</Label>
                      <Input
                        id="modelo"
                        value={formData.modelo}
                        onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="año">Año</Label>
                      <Input
                        id="año"
                        type="number"
                        value={formData.año}
                        onChange={(e) => setFormData({ ...formData, año: Number.parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="placas">Placas</Label>
                      <Input
                        id="placas"
                        value={formData.placas}
                        onChange={(e) => setFormData({ ...formData, placas: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numeroSerie">Número de Serie</Label>
                      <Input
                        id="numeroSerie"
                        value={formData.numeroSerie}
                        onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="precioPorDia">Precio por Día ($)</Label>
                      <Input
                        id="precioPorDia"
                        type="number"
                        value={formData.precioPorDia}
                        onChange={(e) => setFormData({ ...formData, precioPorDia: Number.parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kilometraje">Kilometraje</Label>
                      <Input
                        id="kilometraje"
                        type="number"
                        value={formData.kilometraje}
                        onChange={(e) => setFormData({ ...formData, kilometraje: Number.parseInt(e.target.value) })}
                        required
                      />
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
                          <SelectItem value="disponible">Disponible</SelectItem>
                          <SelectItem value="rentado">Rentado</SelectItem>
                          <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                          <SelectItem value="fuera_servicio">Fuera de Servicio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="combustible">Combustible</Label>
                      <Select
                        value={formData.combustible}
                        onValueChange={(value: any) => setFormData({ ...formData, combustible: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gasolina">Gasolina</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="electrico">Eléctrico</SelectItem>
                          <SelectItem value="hibrido">Híbrido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transmision">Transmisión</Label>
                      <Select
                        value={formData.transmision}
                        onValueChange={(value: any) => setFormData({ ...formData, transmision: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatica">Automática</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoría</Label>
                      <Select
                        value={formData.categoria}
                        onValueChange={(value: any) => setFormData({ ...formData, categoria: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="economico">Económico</SelectItem>
                          <SelectItem value="compacto">Compacto</SelectItem>
                          <SelectItem value="intermedio">Intermedio</SelectItem>
                          <SelectItem value="lujo">Lujo</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingCar ? "Actualizar" : "Crear"} Auto</Button>
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
                placeholder="Buscar por marca, modelo, placas o número de serie..."
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
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="rentado">Rentado</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="fuera_servicio">Fuera de Servicio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cars Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Autos ({filteredCars.length})</CardTitle>
            <CardDescription>Gestiona todos los vehículos registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Placas</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio/Día</TableHead>
                  <TableHead>Kilometraje</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCars.map((car) => (
                  <TableRow key={car._id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>
                          {car.marca} {car.modelo}
                        </p>
                        <p className="text-sm text-gray-500">
                          {car.año} - {car.color}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{car.placas}</TableCell>
                    <TableCell className="capitalize">{car.categoria}</TableCell>
                    <TableCell>${car.precioPorDia}</TableCell>
                    <TableCell>{car.kilometraje.toLocaleString()} km</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(car.estado) as any}>{car.estado.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCar(car)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteCar(car._id!)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
