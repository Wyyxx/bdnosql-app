"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Calendar, DollarSign, Wrench } from "lucide-react"
import Link from "next/link"

interface RepairReport {
  _id: string
  autoInfo: string
  tipoReparacion: string
  descripcion: string
  costo: number
  fechaInicio: string
  fechaFinalizacion?: string
  estado: string
  taller?: string
  tecnico?: string
}

interface ReportSummary {
  totalReparaciones: number
  costoTotal: number
  costoPromedio: number
  reparacionesPendientes: number
  reparacionesCompletadas: number
}

export default function RepairsReportPage() {
  const [repairs, setRepairs] = useState<RepairReport[]>([])
  const [summary, setSummary] = useState<ReportSummary>({
    totalReparaciones: 0,
    costoTotal: 0,
    costoPromedio: 0,
    reparacionesPendientes: 0,
    reparacionesCompletadas: 0,
  })
  const [filters, setFilters] = useState({
    fechaInicio: "",
    fechaFin: "",
    montoMinimo: "",
  })

  useEffect(() => {
    loadRepairsReport()
  }, [filters])

  // TODO: Implementar carga de reporte de reparaciones desde MongoDB (RF04)
  const loadRepairsReport = async () => {
    // Aquí irá la lógica para cargar reporte de reparaciones desde MongoDB
    // Ejemplo: const repairsData = await getRepairsByDateRange(filters.fechaInicio, filters.fechaFin, filters.montoMinimo)

    // Datos simulados
    const mockRepairs: RepairReport[] = [
      {
        _id: "1",
        autoInfo: "Toyota Corolla 2022 - ABC-123",
        tipoReparacion: "Mantenimiento preventivo",
        descripcion: "Cambio de aceite y filtros",
        costo: 1500,
        fechaInicio: "2024-03-01",
        fechaFinalizacion: "2024-03-02",
        estado: "completada",
        taller: "Taller Central",
        tecnico: "Carlos Méndez",
      },
      {
        _id: "2",
        autoInfo: "Honda Civic 2023 - XYZ-789",
        tipoReparacion: "Reparación mayor",
        descripcion: "Reparación de transmisión",
        costo: 8500,
        fechaInicio: "2024-03-05",
        estado: "en_proceso",
        taller: "Taller Especializado",
        tecnico: "Ana López",
      },
      {
        _id: "3",
        autoInfo: "Nissan Sentra 2023 - DEF-456",
        tipoReparacion: "Reparación menor",
        descripcion: "Cambio de llantas",
        costo: 3200,
        fechaInicio: "2024-02-28",
        fechaFinalizacion: "2024-02-28",
        estado: "completada",
        taller: "Taller Central",
        tecnico: "Luis García",
      },
    ]

    // Filtrar por fechas y monto si están especificados
    let filteredRepairs = mockRepairs

    if (filters.fechaInicio) {
      filteredRepairs = filteredRepairs.filter((repair) => repair.fechaInicio >= filters.fechaInicio)
    }

    if (filters.fechaFin) {
      filteredRepairs = filteredRepairs.filter((repair) => repair.fechaInicio <= filters.fechaFin)
    }

    if (filters.montoMinimo) {
      filteredRepairs = filteredRepairs.filter((repair) => repair.costo >= Number.parseFloat(filters.montoMinimo))
    }

    setRepairs(filteredRepairs)

    // Calcular resumen
    const totalReparaciones = filteredRepairs.length
    const costoTotal = filteredRepairs.reduce((sum, repair) => sum + repair.costo, 0)
    const costoPromedio = totalReparaciones > 0 ? costoTotal / totalReparaciones : 0
    const reparacionesPendientes = filteredRepairs.filter((repair) => repair.estado !== "completada").length
    const reparacionesCompletadas = filteredRepairs.filter((repair) => repair.estado === "completada").length

    setSummary({
      totalReparaciones,
      costoTotal,
      costoPromedio,
      reparacionesPendientes,
      reparacionesCompletadas,
    })
  }

  // TODO: Implementar exportación de reporte
  const handleExportReport = () => {
    // Aquí irá la lógica para exportar el reporte a PDF o Excel
    console.log("Exportando reporte de reparaciones:", { repairs, summary, filters })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completada":
        return "outline"
      case "en_proceso":
        return "default"
      case "pendiente":
        return "secondary"
      case "cancelada":
        return "destructive"
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
              <h1 className="text-2xl font-bold text-gray-900">Reporte de Reparaciones</h1>
              <p className="text-gray-600">Consulta reparaciones por periodo de tiempo y monto</p>
            </div>
          </div>

          <Button onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros de Consulta</CardTitle>
            <CardDescription>Especifica el periodo de tiempo y monto para generar el reporte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={filters.fechaInicio}
                  onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha de Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={filters.fechaFin}
                  onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="montoMinimo">Monto Mínimo ($)</Label>
                <Input
                  id="montoMinimo"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={filters.montoMinimo}
                  onChange={(e) => setFilters({ ...filters, montoMinimo: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reparaciones</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalReparaciones}</p>
                </div>
                <Wrench className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Costo Total</p>
                  <p className="text-2xl font-bold text-green-600">${summary.costoTotal.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Costo Promedio</p>
                  <p className="text-2xl font-bold text-blue-600">${summary.costoPromedio.toFixed(0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold text-green-600">{summary.reparacionesCompletadas}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-orange-600">{summary.reparacionesPendientes}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Reparaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Reparaciones ({repairs.length})</CardTitle>
            <CardDescription>Lista detallada de reparaciones según los filtros aplicados</CardDescription>
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
                  <TableHead>Taller/Técnico</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repairs.map((repair) => (
                  <TableRow key={repair._id}>
                    <TableCell className="font-medium">{repair.autoInfo}</TableCell>
                    <TableCell>{repair.tipoReparacion}</TableCell>
                    <TableCell className="max-w-xs truncate">{repair.descripcion}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />${repair.costo.toLocaleString()}
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
                      <div className="text-sm">
                        {repair.taller && <div className="font-medium">{repair.taller}</div>}
                        {repair.tecnico && <div className="text-gray-500">{repair.tecnico}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(repair.estado) as any}>{repair.estado.replace("_", " ")}</Badge>
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
