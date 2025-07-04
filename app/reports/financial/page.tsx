"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"

interface FinancialData {
  mes: string
  ingresosPorRentas: number
  gastosReparaciones: number
  gastosMantenimiento: number
  gastosOperativos: number
  utilidadNeta: number
}

interface FinancialSummary {
  totalIngresos: number
  totalGastos: number
  utilidadNeta: number
  margenUtilidad: number
  mejorMes: string
  peorMes: string
}

export default function FinancialReportPage() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIngresos: 0,
    totalGastos: 0,
    utilidadNeta: 0,
    margenUtilidad: 0,
    mejorMes: "",
    peorMes: "",
  })
  const [filters, setFilters] = useState({
    año: new Date().getFullYear().toString(),
    periodo: "12", // meses
  })

  useEffect(() => {
    loadFinancialReport()
  }, [filters])

  // TODO: Implementar carga de reporte financiero desde MongoDB
  const loadFinancialReport = async () => {
    // Aquí irá la lógica para cargar datos financieros desde MongoDB
    // Ejemplo: const financialData = await getFinancialReport(filters.año, filters.periodo)

    // Datos simulados
    const mockFinancialData: FinancialData[] = [
      {
        mes: "2024-01",
        ingresosPorRentas: 45000,
        gastosReparaciones: 8500,
        gastosMantenimiento: 3200,
        gastosOperativos: 12000,
        utilidadNeta: 21300,
      },
      {
        mes: "2024-02",
        ingresosPorRentas: 52000,
        gastosReparaciones: 12000,
        gastosMantenimiento: 4100,
        gastosOperativos: 13500,
        utilidadNeta: 22400,
      },
      {
        mes: "2024-03",
        ingresosPorRentas: 48000,
        gastosReparaciones: 15500,
        gastosMantenimiento: 2800,
        gastosOperativos: 11200,
        utilidadNeta: 18500,
      },
    ]

    setFinancialData(mockFinancialData)

    // Calcular resumen
    const totalIngresos = mockFinancialData.reduce((sum, data) => sum + data.ingresosPorRentas, 0)
    const totalGastos = mockFinancialData.reduce(
      (sum, data) => sum + data.gastosReparaciones + data.gastosMantenimiento + data.gastosOperativos,
      0,
    )
    const utilidadNeta = mockFinancialData.reduce((sum, data) => sum + data.utilidadNeta, 0)
    const margenUtilidad = totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0

    // Encontrar mejor y peor mes
    const mejorMes = mockFinancialData.reduce((prev, current) =>
      prev.utilidadNeta > current.utilidadNeta ? prev : current,
    )
    const peorMes = mockFinancialData.reduce((prev, current) =>
      prev.utilidadNeta < current.utilidadNeta ? prev : current,
    )

    setSummary({
      totalIngresos,
      totalGastos,
      utilidadNeta,
      margenUtilidad,
      mejorMes: new Date(mejorMes.mes).toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
      peorMes: new Date(peorMes.mes).toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
    })
  }

  // TODO: Implementar exportación de reporte financiero
  const handleExportReport = () => {
    // Aquí irá la lógica para exportar el reporte financiero
    console.log("Exportando reporte financiero:", { financialData, summary, filters })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  const formatMonth = (monthStr: string) => {
    return new Date(monthStr).toLocaleDateString("es-ES", { month: "long", year: "numeric" })
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
              <h1 className="text-2xl font-bold text-gray-900">Análisis Financiero</h1>
              <p className="text-gray-600">Reporte de ingresos, gastos y utilidades</p>
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
            <CardDescription>Selecciona el periodo para generar el análisis financiero</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="año">Año</Label>
                <Input
                  id="año"
                  type="number"
                  value={filters.año}
                  onChange={(e) => setFilters({ ...filters, año: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodo">Periodo</Label>
                <Select value={filters.periodo} onValueChange={(value) => setFilters({ ...filters, periodo: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Últimos 3 meses</SelectItem>
                    <SelectItem value="6">Últimos 6 meses</SelectItem>
                    <SelectItem value="12">Todo el año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen Ejecutivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalIngresos)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalGastos)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilidad Neta</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.utilidadNeta)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Margen de Utilidad</p>
                  <p className="text-2xl font-bold text-purple-600">{summary.margenUtilidad.toFixed(1)}%</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mejor y Peor Mes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Mejor Mes</CardTitle>
              <CardDescription>Mes con mayor utilidad neta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-lg font-semibold">{summary.mejorMes}</p>
                  <p className="text-sm text-gray-600">Mayor rentabilidad del periodo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Mes con Menor Utilidad</CardTitle>
              <CardDescription>Mes que requiere mayor atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <TrendingDown className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-lg font-semibold">{summary.peorMes}</p>
                  <p className="text-sm text-gray-600">Oportunidad de mejora</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalle Mensual */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle Financiero Mensual</CardTitle>
            <CardDescription>Desglose de ingresos, gastos y utilidades por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Mes</th>
                    <th className="text-right p-4 font-medium">Ingresos por Rentas</th>
                    <th className="text-right p-4 font-medium">Gastos Reparaciones</th>
                    <th className="text-right p-4 font-medium">Gastos Mantenimiento</th>
                    <th className="text-right p-4 font-medium">Gastos Operativos</th>
                    <th className="text-right p-4 font-medium">Utilidad Neta</th>
                    <th className="text-right p-4 font-medium">Margen %</th>
                  </tr>
                </thead>
                <tbody>
                  {financialData.map((data, index) => {
                    const totalGastosMes = data.gastosReparaciones + data.gastosMantenimiento + data.gastosOperativos
                    const margenMes =
                      data.ingresosPorRentas > 0 ? (data.utilidadNeta / data.ingresosPorRentas) * 100 : 0

                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{formatMonth(data.mes)}</td>
                        <td className="p-4 text-right text-green-600 font-medium">
                          {formatCurrency(data.ingresosPorRentas)}
                        </td>
                        <td className="p-4 text-right text-red-600">{formatCurrency(data.gastosReparaciones)}</td>
                        <td className="p-4 text-right text-red-600">{formatCurrency(data.gastosMantenimiento)}</td>
                        <td className="p-4 text-right text-red-600">{formatCurrency(data.gastosOperativos)}</td>
                        <td className="p-4 text-right text-blue-600 font-bold">{formatCurrency(data.utilidadNeta)}</td>
                        <td className="p-4 text-right font-medium">{margenMes.toFixed(1)}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
