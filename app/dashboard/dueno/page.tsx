"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Car,
  BarChart3,
  PieChart,
  Calendar,
  FileText,
  Settings,
  Shield,
  Activity,
  Search,
  Filter
} from "lucide-react"

export default function DuenoDashboard() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [stats, setStats] = useState({
    totalAutos: 0,
    autosDisponibles: 0,
    totalClientes: 0,
    totalReparaciones: 0,
    costoTotalReparaciones: 0
  })
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
      
      // Obtener datos de reparaciones
      const reparacionesResponse = await fetch('/api/reparaciones')
      const reparacionesData = await reparacionesResponse.json()

      if (autosData.success && clientesData.success && reparacionesData.success) {
        const autos = autosData.autos || []
        const clientes = clientesData.clientes || []
        const reparaciones = reparacionesData.reparaciones || []

        const costoTotal = reparaciones.reduce((sum: number, rep: any) => sum + rep.costo, 0)

        setStats({
          totalAutos: autos.length,
          autosDisponibles: autos.filter((auto: any) => auto.disponible).length,
          totalClientes: clientes.filter((cliente: any) => cliente.activo).length,
          totalReparaciones: reparaciones.length,
          costoTotalReparaciones: costoTotal
        })
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: "Reporte de Reparaciones",
      description: "Consultar reparaciones por período y monto",
      icon: Search,
      href: "/reports/repairs",
      color: "bg-blue-500"
    }
  ]

  const statsData = [
    { 
      label: "Total de Autos", 
      value: loading ? "..." : stats.totalAutos.toString(), 
      icon: Car, 
      color: "text-blue-600", 
      change: "+0%" 
    },
    { 
      label: "Autos Disponibles", 
      value: loading ? "..." : stats.autosDisponibles.toString(), 
      icon: Car, 
      color: "text-green-600", 
      change: "+0%" 
    },
    { 
      label: "Clientes Activos", 
      value: loading ? "..." : stats.totalClientes.toString(), 
      icon: Users, 
      color: "text-purple-600", 
      change: "+0%" 
    },
    { 
      label: "Reparaciones", 
      value: loading ? "..." : stats.totalReparaciones.toString(), 
      icon: TrendingUp, 
      color: "text-orange-600", 
      change: "+0%" 
    }
  ]

  const [recentReparaciones, setRecentReparaciones] = useState<any[]>([])

  // Obtener reparaciones recientes
  const fetchRecentReparaciones = async () => {
    try {
      const response = await fetch('/api/reparaciones')
      const data = await response.json()
      
      if (data.success) {
        // Tomar las 3 reparaciones más recientes
        const reparaciones = data.reparaciones || []
        const sortedReparaciones = reparaciones
          .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .slice(0, 3)
        
        setRecentReparaciones(sortedReparaciones)
      }
    } catch (error) {
      console.error('Error cargando reparaciones recientes:', error)
    }
  }

  useEffect(() => {
    fetchRecentReparaciones()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Dueño - Administración General
              </h1>
              <p className="text-gray-600">
                Bienvenido, {userInfo?.username} | {userInfo?.userEmail}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Administrativas</h2>
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

        {/* Financial Overview and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Resumen Financiero
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total de Autos</span>
                  <span className="text-lg font-semibold text-blue-600">{loading ? "..." : stats.totalAutos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Autos Disponibles</span>
                  <span className="text-lg font-semibold text-green-600">{loading ? "..." : stats.autosDisponibles}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-sm font-medium text-gray-900">Costo Total Reparaciones</span>
                  <span className="text-xl font-bold text-red-600">
                    {loading ? "..." : `$${stats.costoTotalReparaciones.toLocaleString()}`}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Clientes Activos</span>
                    <span className="text-sm text-gray-600">{loading ? "..." : stats.totalClientes}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: loading ? '0%' : `${Math.min((stats.totalClientes / Math.max(stats.totalAutos, 1)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Reparaciones Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReparaciones.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No hay reparaciones recientes
                  </div>
                ) : (
                  recentReparaciones.map((reparacion, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">REP-{reparacion._id.slice(-6)}</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            Reparación
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{reparacion.descripcion}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(reparacion.fecha).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          -${reparacion.costo.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">{reparacion.taller}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Métricas de Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">Tasa de Ocupación</div>
                  <div className="text-xs text-green-600 mt-1">+5% vs mes anterior</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-gray-600">Satisfacción Cliente</div>
                  <div className="text-xs text-green-600 mt-1">+2% vs mes anterior</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">78%</div>
                  <div className="text-sm text-gray-600">Eficiencia Operativa</div>
                  <div className="text-xs text-green-600 mt-1">+3% vs mes anterior</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Base de Datos</p>
                    <p className="text-xs text-gray-600">Operativo</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Servidor Web</p>
                    <p className="text-xs text-gray-600">Operativo</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Backup</p>
                    <p className="text-xs text-gray-600">En progreso</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Seguridad</p>
                    <p className="text-xs text-gray-600">Actualizada</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 