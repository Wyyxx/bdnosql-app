"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Car,
  Clock
} from "lucide-react"

interface Auto {
  _id: string
  marca: string
  modelo: string
  placas: string
  categoria: string
}

interface Alerta {
  _id: string
  auto_id: string
  tipo: string
  mensaje: string
  severidad: string
  creada_por: string
  resuelta: boolean
  fecha_creacion: string
  fecha_resolucion?: string
  auto?: Auto
}

export default function AlertsPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlertas()
  }, [])

  const fetchAlertas = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/alertas')
      const data = await response.json()

      if (data.success) {
        setAlertas(data.alertas)
      }
    } catch (error) {
      console.error('Error cargando alertas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolveAlert = async (alertaId: string) => {
    try {
      const response = await fetch(`/api/alertas/${alertaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resuelta: true }),
      })

      if (response.ok) {
        fetchAlertas()
      }
    } catch (error) {
      console.error('Error resolviendo alerta:', error)
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'alta':
        return 'bg-red-100 text-red-800'
      case 'media':
        return 'bg-yellow-100 text-yellow-800'
      case 'baja':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeveridadIcon = (severidad: string) => {
    switch (severidad) {
      case 'alta':
        return <XCircle className="w-5 h-5" />
      case 'media':
        return <AlertTriangle className="w-5 h-5" />
      case 'baja':
        return <CheckCircle className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  const alertasActivas = alertas.filter(alerta => !alerta.resuelta)
  const alertasResueltas = alertas.filter(alerta => alerta.resuelta)

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
                  Alertas del Sistema
                </h1>
                <p className="text-gray-600">
                  Vehículos devueltos en mal estado
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Alertas
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Alertas</p>
                  <p className="text-2xl font-bold text-gray-900">{alertas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-red-100">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{alertasActivas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resueltas</p>
                  <p className="text-2xl font-bold text-gray-900">{alertasResueltas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Alta Severidad</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {alertas.filter(a => a.severidad === 'alta' && !a.resuelta).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas Activas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Alertas Activas ({alertasActivas.length})
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando alertas...</p>
            </div>
          ) : alertasActivas.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay alertas activas
                  </h3>
                  <p className="text-gray-600">
                    Todos los vehículos están en buen estado
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alertasActivas.map((alerta) => (
                <Card key={alerta._id} className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getSeveridadIcon(alerta.severidad)}
                          <Badge className={getSeveridadColor(alerta.severidad)}>
                            {alerta.severidad.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {alerta.auto?.marca} {alerta.auto?.modelo}
                          </CardTitle>
                          <CardDescription>
                            Placas: {alerta.auto?.placas} • Creada por: {alerta.creada_por}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {formatearFecha(alerta.fecha_creacion)}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleResolveAlert(alerta._id)}
                          className="mt-2"
                        >
                          Marcar como Resuelta
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{alerta.mensaje}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Alertas Resueltas */}
        {alertasResueltas.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Alertas Resueltas ({alertasResueltas.length})
            </h2>
            <div className="space-y-4">
              {alertasResueltas.map((alerta) => (
                <Card key={alerta._id} className="border-l-4 border-l-green-500 opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <Badge className="bg-green-100 text-green-800">
                            RESUELTA
                          </Badge>
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {alerta.auto?.marca} {alerta.auto?.modelo}
                          </CardTitle>
                          <CardDescription>
                            Placas: {alerta.auto?.placas} • Resuelta por: {alerta.creada_por}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Resuelta: {alerta.fecha_resolucion ? formatearFecha(alerta.fecha_resolucion) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{alerta.mensaje}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
