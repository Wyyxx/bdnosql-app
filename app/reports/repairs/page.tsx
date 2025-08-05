"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  Car,
  Download,
  RefreshCw
} from "lucide-react"
import { Label } from "@/components/ui/label"

interface Reparacion {
  _id: string
  auto_id: string
  descripcion: string
  costo: number
  fecha: string
  taller: string
  auto?: {
    marca: string
    modelo: string
    placas: string
  }
}

export default function RepairsReportPage() {
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([])
  const [loading, setLoading] = useState(false)
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [montoMinimo, setMontoMinimo] = useState("")
  const [montoMaximo, setMontoMaximo] = useState("")
  const [totalCosto, setTotalCosto] = useState(0)
  const [cantidadReparaciones, setCantidadReparaciones] = useState(0)

  // Consultar reparaciones
  const consultarReparaciones = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (fechaInicio) {
        params.append('fecha_inicio', fechaInicio)
      }
      if (fechaFin) {
        params.append('fecha_fin', fechaFin)
      }
      if (montoMinimo) {
        params.append('monto_minimo', montoMinimo)
      }
      if (montoMaximo) {
        params.append('monto_maximo', montoMaximo)
      }

      const url = `/api/reparaciones/report?${params.toString()}`
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setReparaciones(data.reparaciones)
        setTotalCosto(data.total_costo || 0)
        setCantidadReparaciones(data.cantidad || 0)
      } else {
        console.error('Error:', data.error)
        alert('Error consultando reparaciones')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFechaInicio("")
    setFechaFin("")
    setMontoMinimo("")
    setMontoMaximo("")
    setReparaciones([])
    setTotalCosto(0)
    setCantidadReparaciones(0)
  }

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Formatear monto
  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Reporte de Reparaciones
              </h1>
              <p className="text-gray-600">
                Consulta reparaciones por período de tiempo y monto
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                Volver
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros de Consulta
            </CardTitle>
            <CardDescription>
              Define el período de tiempo y rango de montos para consultar las reparaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fecha_fin">Fecha de Fin</Label>
                <Input
                  id="fecha_fin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monto_minimo">Monto Mínimo</Label>
                <Input
                  id="monto_minimo"
                  type="number"
                  placeholder="0"
                  value={montoMinimo}
                  onChange={(e) => setMontoMinimo(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monto_maximo">Monto Máximo</Label>
                <Input
                  id="monto_maximo"
                  type="number"
                  placeholder="10000"
                  value={montoMaximo}
                  onChange={(e) => setMontoMaximo(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={consultarReparaciones} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Consultar
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resumen */}
        {cantidadReparaciones > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{cantidadReparaciones}</div>
                  <div className="text-sm text-gray-600">Reparaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatearMonto(totalCosto)}</div>
                  <div className="text-sm text-gray-600">Costo Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatearMonto(totalCosto / cantidadReparaciones)}</div>
                  <div className="text-sm text-gray-600">Promedio por Reparación</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de reparaciones */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">Consultando reparaciones...</div>
              </CardContent>
            </Card>
          ) : reparaciones.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  {cantidadReparaciones === 0 && !loading ? 
                    "No se encontraron reparaciones con los filtros aplicados" : 
                    "Ingresa los filtros y haz clic en Consultar"
                  }
                </div>
              </CardContent>
            </Card>
          ) : (
            reparaciones.map((reparacion) => (
              <Card key={reparacion._id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {reparacion.descripcion}
                        </h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {formatearMonto(reparacion.costo)}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p><strong>Auto:</strong> {reparacion.auto ? `${reparacion.auto.marca} ${reparacion.auto.modelo} (${reparacion.auto.placas})` : 'Auto no encontrado'}</p>
                        <p><strong>Taller:</strong> {reparacion.taller}</p>
                        <p><strong>Fecha:</strong> {formatearFecha(reparacion.fecha)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {reparacion.auto?.placas || 'Sin placas'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
