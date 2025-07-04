"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, TrendingUp, DollarSign, Car } from "lucide-react"
import Link from "next/link"

interface RentalReport {
  _id: string
  autoInfo: string
  marca: string
  modelo: string
  categoria: string
  totalRentas: number
  ingresoTotal: number
  diasRentados: number
  ingresoPromedioPorDia: number
  ultimaRenta: string
}

export default function RentalsReportPage() {
  const [mostRentedCars, setMostRentedCars] = useState<RentalReport[]>([])
  const [periodFilter, setPeriodFilter] = useState("2") // meses
  const [summary, setSummary] = useState({
    totalIngresos: 0,
    totalRentas: 0,
    autoMasRentado: "",
    categoriaPopular: "",
  })

  useEffect(() => {
    loadMostRentedCars()
  }, [periodFilter])

  // TODO: Implementar carga de autos más rentados desde MongoDB (RF06)
  const loadMostRentedCars = async () => {
    // Aquí irá la lógica para cargar autos más rentados desde MongoDB
    // Ejemplo: const rentalsData = await getMostRentedCars(parseInt(periodFilter))

    // Datos simulados
    const mockRentals: RentalReport[] = [
      {
        _id: "1",
        autoInfo: "Toyota Corolla 2022 - ABC-123",
        marca: "Toyota",
        modelo: "Corolla",
        categoria: "compacto",
        totalRentas: 8,
        ingresoTotal: 25600,
        diasRentados: 32,
        ingresoPromedioPorDia: 800,
        ultimaRenta: "2024-03-05",
      },
      {
        _id: "2",
        autoInfo: "Honda Civic 2023 - XYZ-789",
        marca: "Honda",
        modelo: "Civic",
        categoria: "compacto",
        totalRentas: 6,
        ingresoTotal: 21600,
        diasRentados: 24,
        ingresoPromedioPorDia: 900,
        ultimaRenta: "2024-03-03",
      },
      {
        _id: "3",
        autoInfo: "Nissan Sentra 2023 - DEF-456",
        marca: "Nissan",
        modelo: "Sentra",
        categoria: "compacto",
        totalRentas: 5,
        ingresoTotal: 15000,
        diasRentados: 20,
        ingresoPromedioPorDia: 750,
        ultimaRenta: "2024-02-28",
      },
      {
        _id: "4",
        autoInfo: "Honda CR-V 2023 - GHI-789",
        marca: "Honda",
        modelo: "CR-V",
        categoria: "suv",
        totalRentas: 4,
        ingresoTotal: 19200,
        diasRentados: 16,
        ingresoPromedioPorDia: 1200,
        ultimaRenta: "2024-03-01",
      },
    ]

    setMostRentedCars(mockRentals)

    // Calcular resumen
    const totalIngresos = mockRentals.reduce((sum, car) => sum + car.ingresoTotal, 0)
    const totalRentas = mockRentals.reduce((sum, car) => sum + car.totalRentas, 0)
    const autoMasRentado = mockRentals.length > 0 ? mockRentals[0].autoInfo : ""

    // Encontrar categoría más popular
    const categorias = mockRentals.reduce(
      (acc, car) => {
        acc[car.categoria] = (acc[car.categoria] || 0) + car.totalRentas
        return acc
      },
      {} as Record<string, number>,
    )

    const categoriaPopular =
      Object.entries(categorias).reduce((a, b) => (categorias[a[0]] > categorias[b[0]] ? a : b))[0] || ""

    setSummary({
      totalIngresos,
      totalRentas,
      autoMasRentado,
      categoriaPopular,
    })
  }

  // TODO: Implementar exportación de reporte
  const handleExportReport = () => {
    // Aquí irá la lógica para exportar el reporte a PDF o Excel
    console.log("Exportando reporte de rentas:", { mostRentedCars, summary, periodFilter })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "economico":
        return "bg-green-100 text-green-800"
      case "compacto":
        return "bg-blue-100 text-blue-800"
      case "intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "lujo":
        return "bg-purple-100 text-purple-800"
      case "suv":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              <h1 className="text-2xl font-bold text-gray-900">Reporte de Autos Más Rentados</h1>
              <p className="text-gray-600">Análisis de rendimiento de vehículos por periodo</p>
            </div>
          </div>

          <Button onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>

        {/* Filtro de Periodo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Periodo de Análisis</CardTitle>
            <CardDescription>Selecciona el periodo para generar el reporte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Último mes</SelectItem>
                  <SelectItem value="2">Últimos 2 meses</SelectItem>
                  <SelectItem value="3">Últimos 3 meses</SelectItem>
                  <SelectItem value="6">Últimos 6 meses</SelectItem>
                  <SelectItem value="12">Último año</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">
                Mostrando datos de los últimos {periodFilter} {Number.parseInt(periodFilter) === 1 ? "mes" : "meses"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-green-600">${summary.totalIngresos.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rentas</p>
                  <p className="text-2xl font-bold text-blue-600">{summary.totalRentas}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Auto Más Rentado</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{summary.autoMasRentado}</p>
                </div>
                <Car className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categoría Popular</p>
                  <p className="text-lg font-bold text-orange-600 capitalize">{summary.categoriaPopular}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Autos Más Rentados */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Vehículos ({mostRentedCars.length})</CardTitle>
            <CardDescription>Vehículos ordenados por número de rentas en el periodo seleccionado</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ranking</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Total Rentas</TableHead>
                  <TableHead>Días Rentados</TableHead>
                  <TableHead>Ingreso Total</TableHead>
                  <TableHead>Ingreso/Día</TableHead>
                  <TableHead>Última Renta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostRentedCars.map((car, index) => (
                  <TableRow key={car._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                  ? "bg-orange-600"
                                  : "bg-gray-300"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">
                          {car.marca} {car.modelo}
                        </p>
                        <p className="text-sm text-gray-500">{car.autoInfo}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(car.categoria)}>{car.categoria}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold">{car.totalRentas}</span>
                      </div>
                    </TableCell>
                    <TableCell>{car.diasRentados} días</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-600">${car.ingresoTotal.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-600">${car.ingresoPromedioPorDia}</span>
                    </TableCell>
                    <TableCell>{new Date(car.ultimaRenta).toLocaleDateString()}</TableCell>
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
