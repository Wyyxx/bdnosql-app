"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, AlertTriangle, CheckCircle, Clock, Car } from "lucide-react"
import Link from "next/link"

interface Alert {
  _id: string
  tipo: "vehiculo_mal_estado" | "renta_vencida" | "mantenimiento_programado" | "multa_pendiente"
  autoId?: string
  autoInfo?: string
  rentalId?: string
  clienteNombre?: string
  mensaje: string
  estado: "activa" | "resuelta"
  prioridad: "alta" | "media" | "baja"
  fechaCreacion: string
  fechaResolucion?: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    loadAlerts()
  }, [])

  // TODO: Implementar carga de alertas desde MongoDB
  const loadAlerts = async () => {
    // Aquí irá la lógica para cargar alertas desde MongoDB
    // Ejemplo: const alertsData = await getVehicleAlerts()

    // Datos simulados
    const mockAlerts: Alert[] = [
      {
        _id: "1",
        tipo: "vehiculo_mal_estado",
        autoId: "2",
        autoInfo: "Honda Civic 2023 - XYZ-789",
        mensaje: "Vehículo devuelto en mal estado: Rayón en puerta lateral derecha, llanta desinflada",
        estado: "activa",
        prioridad: "alta",
        fechaCreacion: "2024-03-03",
      },
      {
        _id: "2",
        tipo: "renta_vencida",
        rentalId: "3",
        autoInfo: "Nissan Sentra 2023 - DEF-456",
        clienteNombre: "Carlos López",
        mensaje: "Renta vencida desde hace 2 días. Cliente no ha devuelto el vehículo.",
        estado: "activa",
        prioridad: "alta",
        fechaCreacion: "2024-03-06",
      },
      {
        _id: "3",
        tipo: "mantenimiento_programado",
        autoId: "1",
        autoInfo: "Toyota Corolla 2022 - ABC-123",
        mensaje: "Mantenimiento programado para 20,000 km. Kilometraje actual: 19,800 km",
        estado: "activa",
        prioridad: "media",
        fechaCreacion: "2024-03-01",
      },
      {
        _id: "4",
        tipo: "multa_pendiente",
        rentalId: "2",
        autoInfo: "Honda Civic 2023 - XYZ-789",
        clienteNombre: "María González",
        mensaje: "Multa pendiente de $2,500 por daños en vehículo",
        estado: "resuelta",
        prioridad: "media",
        fechaCreacion: "2024-02-28",
        fechaResolucion: "2024-03-05",
      },
    ]
    setAlerts(mockAlerts)
  }

  // TODO: Implementar resolución de alerta en MongoDB
  const handleResolveAlert = async (alertId: string) => {
    if (confirm("¿Estás seguro de que deseas marcar esta alerta como resuelta?")) {
      // Ejemplo: await resolveAlert(alertId)
      console.log("Resolviendo alerta:", alertId)
      await loadAlerts()
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.autoInfo && alert.autoInfo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alert.clienteNombre && alert.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = filterStatus === "all" || alert.estado === filterStatus
    const matchesType = filterType === "all" || alert.tipo === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vehiculo_mal_estado":
        return "bg-red-100 text-red-800"
      case "renta_vencida":
        return "bg-orange-100 text-orange-800"
      case "mantenimiento_programado":
        return "bg-blue-100 text-blue-800"
      case "multa_pendiente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "destructive"
      case "media":
        return "secondary"
      case "baja":
        return "outline"
      default:
        return "default"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vehiculo_mal_estado":
        return <AlertTriangle className="w-4 h-4" />
      case "renta_vencida":
        return <Clock className="w-4 h-4" />
      case "mantenimiento_programado":
        return <Car className="w-4 h-4" />
      case "multa_pendiente":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "vehiculo_mal_estado":
        return "Vehículo Mal Estado"
      case "renta_vencida":
        return "Renta Vencida"
      case "mantenimiento_programado":
        return "Mantenimiento"
      case "multa_pendiente":
        return "Multa Pendiente"
      default:
        return type
    }
  }

  const activeAlertsCount = alerts.filter((alert) => alert.estado === "activa").length
  const highPriorityCount = alerts.filter((alert) => alert.estado === "activa" && alert.prioridad === "alta").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistema de Alertas</h1>
            <p className="text-gray-600">Monitoreo de vehículos y situaciones críticas</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{activeAlertsCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prioridad Alta</p>
                  <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Alertas</p>
                  <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por mensaje, vehículo o cliente..."
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
                  <SelectItem value="activa">Activas</SelectItem>
                  <SelectItem value="resuelta">Resueltas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="vehiculo_mal_estado">Vehículo Mal Estado</SelectItem>
                  <SelectItem value="renta_vencida">Renta Vencida</SelectItem>
                  <SelectItem value="mantenimiento_programado">Mantenimiento</SelectItem>
                  <SelectItem value="multa_pendiente">Multa Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Alertas ({filteredAlerts.length})</CardTitle>
            <CardDescription>Monitoreo y seguimiento de situaciones que requieren atención</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Vehículo/Cliente</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(alert.tipo)}
                        <Badge className={getTypeColor(alert.tipo)}>{getTypeLabel(alert.tipo)}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {alert.autoInfo && <div className="font-medium">{alert.autoInfo}</div>}
                        {alert.clienteNombre && <div className="text-gray-500">{alert.clienteNombre}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm">{alert.mensaje}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(alert.prioridad) as any}>{alert.prioridad}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={alert.estado === "activa" ? "destructive" : "secondary"}>{alert.estado}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Creada: {new Date(alert.fechaCreacion).toLocaleDateString()}</div>
                        {alert.fechaResolucion && (
                          <div className="text-gray-500">
                            Resuelta: {new Date(alert.fechaResolucion).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {alert.estado === "activa" && (
                        <Button variant="outline" size="sm" onClick={() => handleResolveAlert(alert._id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolver
                        </Button>
                      )}
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
