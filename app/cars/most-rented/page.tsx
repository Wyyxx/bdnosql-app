"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  TrendingUp, 
  Calendar,
  DollarSign,
  ArrowLeft
} from "lucide-react"

interface Auto {
  _id: string
  marca: string
  modelo: string
  placas: string
  categoria: string
  disponible: boolean
}

interface Renta {
  fecha_inicio: string
  fecha_fin: string
  precio_total: number
  estatus: string
}

interface AutoMasRentado {
  auto: Auto
  totalRentas: number
  totalIngresos: number
  rentas: Renta[]
}

export default function AutosMasRentadosPage() {
  const [autosMasRentados, setAutosMasRentados] = useState<AutoMasRentado[]>([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState<{ desde: string; hasta: string } | null>(null)

  useEffect(() => {
    fetchAutosMasRentados()
  }, [])

  const fetchAutosMasRentados = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/autos/most-rented')
      const data = await response.json()

      if (data.success) {
        setAutosMasRentados(data.autosMasRentados)
        setPeriodo(data.periodo)
      } else {
        console.error('Error obteniendo autos más rentados:', data.error)
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES')
  }

  const formatearPrecio = (precio: number) => {
    return `$${precio.toLocaleString()}`
  }

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'activa':
        return 'bg-green-100 text-green-800'
      case 'finalizada':
        return 'bg-blue-100 text-blue-800'
      case 'cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Autos Más Rentados
                </h1>
                <p className="text-gray-600">
                  Últimos 2 meses
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Reporte
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resumen del período */}
        {periodo && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Período de Análisis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Desde</p>
                  <p className="text-lg font-semibold">{formatearFecha(periodo.desde)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Hasta</p>
                  <p className="text-lg font-semibold">{formatearFecha(periodo.hasta)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de autos más rentados */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Ranking de Autos Más Rentados
            </h2>
            <Badge variant="outline" className="text-sm">
              {autosMasRentados.length} autos encontrados
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando datos...</p>
            </div>
          ) : autosMasRentados.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay datos disponibles
                  </h3>
                  <p className="text-gray-600">
                    No se encontraron rentas en los últimos 2 meses
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {autosMasRentados.map((item, index) => (
                <Card key={item.auto._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                          <span className="text-xl font-bold text-blue-600">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {item.auto.marca} {item.auto.modelo}
                          </CardTitle>
                          <CardDescription>
                            Placas: {item.auto.placas} • {item.auto.categoria}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge 
                          variant={item.auto.disponible ? "default" : "secondary"}
                          className={item.auto.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {item.auto.disponible ? 'Disponible' : 'No disponible'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Estadísticas */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Total Rentas</span>
                          </div>
                          <span className="text-2xl font-bold text-blue-600">
                            {item.totalRentas}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Ingresos</span>
                          </div>
                          <span className="text-2xl font-bold text-green-600">
                            {formatearPrecio(item.totalIngresos)}
                          </span>
                        </div>
                      </div>

                      {/* Rentas recientes */}
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-3">Rentas Recientes</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {item.rentas.slice(0, 5).map((renta, rentaIndex) => (
                            <div key={rentaIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {formatearFecha(renta.fecha_inicio)} - {formatearFecha(renta.fecha_fin)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatearPrecio(renta.precio_total)}
                                </p>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getEstatusColor(renta.estatus)}`}
                              >
                                {renta.estatus}
                              </Badge>
                            </div>
                          ))}
                          {item.rentas.length > 5 && (
                            <p className="text-xs text-gray-500 text-center py-2">
                              +{item.rentas.length - 5} rentas más
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 