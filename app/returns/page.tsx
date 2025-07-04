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
import { Plus, Search, ArrowLeft, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface Return {
  _id?: string
  rentalId: string
  clienteNombre: string
  autoInfo: string
  fechaDevolucion: string
  estadoVehiculo: "bueno" | "regular" | "malo"
  kilometrajeDevolucion: number
  kilometrajeInicial: number
  danosReportados?: string
  multasPendientes: number
  observaciones?: string
  fechaRegistro: string
}

interface ActiveRental {
  _id: string
  clienteNombre: string
  autoInfo: string
  fechaInicio: string
  fechaFin: string
  kilometrajeInicial: number
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<Return[]>([])
  const [activeRentals, setActiveRentals] = useState<ActiveRental[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Return>({
    rentalId: "",
    clienteNombre: "",
    autoInfo: "",
    fechaDevolucion: new Date().toISOString().split("T")[0],
    estadoVehiculo: "bueno",
    kilometrajeDevolucion: 0,
    kilometrajeInicial: 0,
    danosReportados: "",
    multasPendientes: 0,
    observaciones: "",
    fechaRegistro: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadReturns()
    loadActiveRentals()
  }, [])

  // TODO: Implementar carga de devoluciones desde MongoDB
  const loadReturns = async () => {
    // Aquí irá la lógica para cargar devoluciones desde MongoDB
    // Ejemplo: const returnsData = await getReturns()

    // Datos simulados
    const mockReturns: Return[] = [
      {
        _id: "1",
        rentalId: "1",
        clienteNombre: "Juan Pérez",
        autoInfo: "Toyota Corolla 2022 - ABC-123",
        fechaDevolucion: "2024-03-05",
        estadoVehiculo: "bueno",
        kilometrajeDevolucion: 15250,
        kilometrajeInicial: 15000,
        multasPendientes: 0,
        observaciones: "Vehículo devuelto en excelente estado",
        fechaRegistro: "2024-03-05",
      },
      {
        _id: "2",
        rentalId: "2",
        clienteNombre: "María González",
        autoInfo: "Honda Civic 2023 - XYZ-789",
        fechaDevolucion: "2024-03-03",
        estadoVehiculo: "malo",
        kilometrajeDevolucion: 8500,
        kilometrajeInicial: 8000,
        danosReportados: "Rayón en puerta lateral derecha, llanta desinflada",
        multasPendientes: 2500,
        observaciones: "Requiere reparación antes de volver a rentar",
        fechaRegistro: "2024-03-03",
      },
    ]
    setReturns(mockReturns)
  }

  // TODO: Implementar carga de rentas activas desde MongoDB
  const loadActiveRentals = async () => {
    // Aquí irá la lógica para cargar rentas activas desde MongoDB
    // Ejemplo: const activeRentalsData = await getActiveRentals()

    // Datos simulados
    const mockActiveRentals: ActiveRental[] = [
      {
        _id: "3",
        clienteNombre: "Carlos López",
        autoInfo: "Nissan Sentra 2023 - DEF-456",
        fechaInicio: "2024-03-01",
        fechaFin: "2024-03-06",
        kilometrajeInicial: 8000,
      },
      {
        _id: "4",
        clienteNombre: "Ana Martínez",
        autoInfo: "Honda CR-V 2023 - GHI-789",
        fechaInicio: "2024-03-02",
        fechaFin: "2024-03-07",
        kilometrajeInicial: 12000,
      },
    ]
    setActiveRentals(mockActiveRentals)
  }

  // TODO: Implementar registro de devolución en MongoDB
  const handleSaveReturn = async (e: React.FormEvent) => {
    e.preventDefault()

    // Crear nueva devolución
    // Ejemplo: await createReturn(formData)
    // También actualizar estado del auto y renta
    console.log("Registrando devolución:", formData)

    // TODO: Crear alerta si el vehículo está en mal estado (RF08)
    if (formData.estadoVehiculo === "malo") {
      // Ejemplo: await createVehicleAlert({
      //   autoId: formData.autoId,
      //   mensaje: `Vehículo devuelto en mal estado: ${formData.danosReportados}`,
      //   tipo: 'vehiculo_mal_estado'
      // })
      console.log("Creando alerta de vehículo en mal estado")
    }

    await loadReturns()
    await loadActiveRentals()

    // Resetear formulario
    setFormData({
      rentalId: "",
      clienteNombre: "",
      autoInfo: "",
      fechaDevolucion: new Date().toISOString().split("T")[0],
      estadoVehiculo: "bueno",
      kilometrajeDevolucion: 0,
      kilometrajeInicial: 0,
      danosReportados: "",
      multasPendientes: 0,
      observaciones: "",
      fechaRegistro: new Date().toISOString().split("T")[0],
    })
    setIsDialogOpen(false)
  }

  const handleRentalChange = (rentalId: string) => {
    const rental = activeRentals.find((r) => r._id === rentalId)
    if (rental) {
      setFormData((prev) => ({
        ...prev,
        rentalId: rentalId,
        clienteNombre: rental.clienteNombre,
        autoInfo: rental.autoInfo,
        kilometrajeInicial: rental.kilometrajeInicial,
      }))
    }
  }

  const filteredReturns = returns.filter((returnItem) => {
    const matchesSearch =
      returnItem.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.autoInfo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || returnItem.estadoVehiculo === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "bueno":
        return "default"
      case "regular":
        return "secondary"
      case "malo":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "bueno":
        return <CheckCircle className="w-4 h-4" />
      case "regular":
        return <AlertTriangle className="w-4 h-4" />
      case "malo":
        return <XCircle className="w-4 h-4" />
      default:
        return null
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Devoluciones</h1>
              <p className="text-gray-600">Registrar devoluciones de vehículos</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setFormData({
                    rentalId: "",
                    clienteNombre: "",
                    autoInfo: "",
                    fechaDevolucion: new Date().toISOString().split("T")[0],
                    estadoVehiculo: "bueno",
                    kilometrajeDevolucion: 0,
                    kilometrajeInicial: 0,
                    danosReportados: "",
                    multasPendientes: 0,
                    observaciones: "",
                    fechaRegistro: new Date().toISOString().split("T")[0],
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Devolución
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Registrar Devolución</DialogTitle>
                <DialogDescription>Registra la devolución de un vehículo rentado</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveReturn}>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="rental">Renta Activa</Label>
                    <Select value={formData.rentalId} onValueChange={handleRentalChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar renta a devolver" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeRentals.map((rental) => (
                          <SelectItem key={rental._id} value={rental._id}>
                            {rental.clienteNombre} - {rental.autoInfo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.rentalId && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fechaDevolucion">Fecha de Devolución</Label>
                          <Input
                            id="fechaDevolucion"
                            type="date"
                            value={formData.fechaDevolucion}
                            onChange={(e) => setFormData({ ...formData, fechaDevolucion: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estadoVehiculo">Estado del Vehículo</Label>
                          <Select
                            value={formData.estadoVehiculo}
                            onValueChange={(value: any) => setFormData({ ...formData, estadoVehiculo: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bueno">Bueno</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="malo">Malo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="kilometrajeInicial">Kilometraje Inicial</Label>
                          <Input
                            id="kilometrajeInicial"
                            type="number"
                            value={formData.kilometrajeInicial}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="kilometrajeDevolucion">Kilometraje Devolución</Label>
                          <Input
                            id="kilometrajeDevolucion"
                            type="number"
                            value={formData.kilometrajeDevolucion}
                            onChange={(e) =>
                              setFormData({ ...formData, kilometrajeDevolucion: Number.parseInt(e.target.value) || 0 })
                            }
                            required
                          />
                        </div>
                      </div>

                      {formData.estadoVehiculo !== "bueno" && (
                        <div className="space-y-2">
                          <Label htmlFor="danosReportados">Daños Reportados</Label>
                          <Textarea
                            id="danosReportados"
                            value={formData.danosReportados || ""}
                            onChange={(e) => setFormData({ ...formData, danosReportados: e.target.value })}
                            placeholder="Describe los daños encontrados en el vehículo..."
                            required={formData.estadoVehiculo !== "bueno"}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="multasPendientes">Multas Pendientes ($)</Label>
                        <Input
                          id="multasPendientes"
                          type="number"
                          step="0.01"
                          value={formData.multasPendientes}
                          onChange={(e) =>
                            setFormData({ ...formData, multasPendientes: Number.parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea
                          id="observaciones"
                          value={formData.observaciones || ""}
                          onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                          placeholder="Observaciones adicionales sobre la devolución..."
                        />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={!formData.rentalId}>
                    Registrar Devolución
                  </Button>
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
                  <SelectItem value="bueno">Bueno</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="malo">Malo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Returns Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Devoluciones ({filteredReturns.length})</CardTitle>
            <CardDescription>Historial de devoluciones de vehículos</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Fecha Devolución</TableHead>
                  <TableHead>Estado Vehículo</TableHead>
                  <TableHead>Kilometraje</TableHead>
                  <TableHead>Multas</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((returnItem) => (
                  <TableRow key={returnItem._id}>
                    <TableCell className="font-medium">{returnItem.clienteNombre}</TableCell>
                    <TableCell>{returnItem.autoInfo}</TableCell>
                    <TableCell>{new Date(returnItem.fechaDevolucion).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(returnItem.estadoVehiculo)}
                        <Badge variant={getStatusColor(returnItem.estadoVehiculo) as any}>
                          {returnItem.estadoVehiculo}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Inicial: {returnItem.kilometrajeInicial?.toLocaleString()} km</div>
                        <div>Final: {returnItem.kilometrajeDevolucion.toLocaleString()} km</div>
                        <div className="text-gray-500">
                          Recorrido:{" "}
                          {(returnItem.kilometrajeDevolucion - (returnItem.kilometrajeInicial || 0)).toLocaleString()}{" "}
                          km
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {returnItem.multasPendientes > 0 ? (
                        <span className="text-red-600 font-medium">${returnItem.multasPendientes}</span>
                      ) : (
                        <span className="text-green-600">Sin multas</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{returnItem.observaciones || "-"}</TableCell>
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
