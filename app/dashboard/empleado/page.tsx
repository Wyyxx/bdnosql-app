"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Car, 
  FileText, 
  Calendar,
  UserCheck,
  Clock,
  TrendingUp,
  AlertCircle,
  Search,
  CheckCircle
} from "lucide-react"
import NotificationsPanel from "@/components/notifications-panel"

export default function EmpleadoDashboard() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [stats, setStats] = useState({
    totalAutos: 0,
    autosDisponibles: 0,
    totalClientes: 0,
    clientesActivos: 0
  })
  const [rentas, setRentas] = useState<any[]>([])
  const [alertas, setAlertas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = localStorage.getItem("username")
    const userRole = localStorage.getItem("userRole")
    const userEmail = localStorage.getItem("userEmail")
    
    setUserInfo({ username, userRole, userEmail })
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Obtener datos de autos
      const autosResponse = await fetch('/api/autos')
      const autosData = await autosResponse.json()
      
      // Obtener datos de clientes
      const clientesResponse = await fetch('/api/clientes')
      const clientesData = await clientesResponse.json()

      // Obtener datos de rentas
      const rentasResponse = await fetch('/api/rentas')
      const rentasData = await rentasResponse.json()

      // Obtener alertas de devoluciones
      const alertasResponse = await fetch('/api/alertas?tipo=vehiculo_mal_estado&resuelta=false')
      const alertasData = await alertasResponse.json()

      if (autosData.success && clientesData.success && rentasData.success) {
        const autos = autosData.autos || []
        const clientes = clientesData.clientes || []
        const rentas = rentasData.rentas || []
        const alertas = alertasData.success ? alertasData.alertas || [] : []

        setStats({
          totalAutos: autos.length,
          autosDisponibles: autos.filter((auto: any) => auto.disponible).length,
          totalClientes: clientes.length,
          clientesActivos: clientes.filter((cliente: any) => cliente.activo).length
        })
        
        // Obtener las 3 rentas más recientes
        const rentasRecientes = rentas
          .sort((a: any, b: any) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime())
          .slice(0, 3)
        
        setRentas(rentasRecientes)
        setAlertas(alertas)
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const resolverAlerta = async (alertaId: string) => {
    try {
      const response = await fetch(`/api/alertas/${alertaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resuelta: true }),
      })

      if (response.ok) {
        // Remover la alerta de la lista
        setAlertas(prev => prev.filter(alerta => alerta._id !== alertaId))
        alert('Alerta marcada como resuelta')
      } else {
        alert('Error al resolver la alerta')
      }
    } catch (error) {
      console.error('Error resolviendo alerta:', error)
      alert('Error al resolver la alerta')
    }
  }

  const quickActions = [
    {
      title: "Buscar Vehículos",
      description: "Consultar vehículos disponibles",
      icon: Search,
      href: "/cars/search",
      color: "bg-blue-500"
    },
    {
      title: "Gestionar Clientes",
      description: "Mantener datos de clientes",
      icon: Users,
      href: "/clients",
      color: "bg-green-500"
    },
    {
      title: "Gestionar Rentas",
      description: "Registrar y actualizar rentas",
      icon: Car,
      href: "/rentals",
      color: "bg-purple-500"
    }
  ]

  const statsData = [
    { 
      label: "Total de Vehículos", 
      value: loading ? "..." : stats.totalAutos.toString(), 
      icon: Car, 
      color: "text-blue-600" 
    },
    { 
      label: "Vehículos Disponibles", 
      value: loading ? "..." : stats.autosDisponibles.toString(), 
      icon: Car, 
      color: "text-green-600" 
    },
    { 
      label: "Total de Clientes", 
      value: loading ? "..." : stats.totalClientes.toString(), 
      icon: Users, 
      color: "text-purple-600" 
    },
    { 
      label: "Clientes Activos", 
      value: loading ? "..." : stats.clientesActivos.toString(), 
      icon: UserCheck, 
      color: "text-green-600" 
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Empleado - Atención al Público
              </h1>
              <p className="text-gray-600">
                Bienvenido, {userInfo?.username} | {userInfo?.userEmail}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {alertas.length > 0 && (
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  {alertas.length} alerta{alertas.length !== 1 ? 's' : ''} activa{alertas.length !== 1 ? 's' : ''}
                </Badge>
              )}
              <NotificationsPanel usuarioId={userInfo?.userEmail || ''} />
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {userInfo?.userRole}
              </Badge>
              <Button variant="outline" onClick={() => {
                localStorage.clear()
                // Limpiar cookies
                document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                document.cookie = "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                window.location.href = "/"
              }}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => window.location.href = action.href}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color} text-white`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Rentas Recientes y Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="w-5 h-5 mr-2" />
                Rentas Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center text-gray-500">Cargando rentas...</div>
                ) : rentas.length === 0 ? (
                  <div className="text-center text-gray-500">No hay rentas registradas</div>
                ) : (
                  rentas.map((renta, index) => (
                    <div key={renta._id} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        renta.estatus === 'activa' ? 'bg-green-500' :
                        renta.estatus === 'finalizada' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {renta.cliente?.nombre || 'Cliente no encontrado'} - {renta.auto ? `${renta.auto.marca} ${renta.auto.modelo}` : 'Vehículo no encontrado'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(renta.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(renta.fecha_fin).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${renta.precio_total?.toLocaleString()} - {renta.estatus}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Alertas y Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center text-gray-500">Cargando alertas...</div>
                ) : alertas.length === 0 ? (
                  <div className="text-center text-gray-500">No hay alertas activas</div>
                ) : (
                  alertas.slice(0, 5).map((alerta, index) => (
                    <div 
                      key={alerta._id} 
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                        alerta.severidad === 'alta' 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <AlertCircle className={`w-5 h-5 mt-0.5 ${
                        alerta.severidad === 'alta' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          alerta.severidad === 'alta' ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                          🚗 Vehículo Devuelto en {alerta.severidad === 'alta' ? 'Mal Estado' : 'Estado Regular'}
                        </p>
                        {alerta.auto && (
                          <p className="text-xs text-gray-600 mb-1">
                            {alerta.auto.marca} {alerta.auto.modelo} ({alerta.auto.placas})
                          </p>
                        )}
                        <p className="text-xs text-gray-600 mb-1">
                          {alerta.mensaje}
                        </p>
                        <p className="text-xs text-gray-500">
                          Creada por: {alerta.creada_por} • {new Date(alerta.fecha_creacion).toLocaleString('es-ES')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resolverAlerta(alerta._id)}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Marcar como resuelta"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
                {alertas.length > 5 && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Y {alertas.length - 5} alerta{alertas.length - 5 !== 1 ? 's' : ''} más...
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 