"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Users, Wrench, FileText, AlertTriangle, TrendingUp, Calendar, DollarSign, LogOut } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [userRole, setUserRole] = useState("")
  const [username, setUsername] = useState("")
  const [stats, setStats] = useState({
    totalClients: 0,
    totalCars: 0,
    activeRentals: 0,
    pendingReturns: 0,
    alerts: 0,
  })

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const role = localStorage.getItem("userRole") || ""
    const user = localStorage.getItem("username") || ""
    setUserRole(role)
    setUsername(user)

    // TODO: Cargar estadísticas desde MongoDB
    loadDashboardStats()
  }, [])

  // TODO: Implementar carga de estadísticas desde MongoDB
  const loadDashboardStats = async () => {
    // Aquí irá la lógica para cargar estadísticas desde MongoDB
    // Ejemplo: const stats = await getDashboardStats(userRole)

    // Datos simulados
    setStats({
      totalClients: 150,
      totalCars: 45,
      activeRentals: 23,
      pendingReturns: 5,
      alerts: 3,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    window.location.href = "/"
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "empleado":
        return "Empleado Atención al Público"
      case "encargado":
        return "Encargado de Autos"
      case "dueno":
        return "Dueño"
      default:
        return "Usuario"
    }
  }

  const getMenuItems = () => {
    const baseItems = []

    if (userRole === "empleado") {
      baseItems.push(
        {
          title: "Gestión de Clientes",
          description: "Registrar y mantener datos de clientes",
          href: "/clients",
          icon: Users,
          color: "bg-blue-500",
        },
        {
          title: "Buscar Vehículos",
          description: "Consultar vehículos disponibles",
          href: "/cars/search",
          icon: Car,
          color: "bg-green-500",
        },
        {
          title: "Gestión de Rentas",
          description: "Registrar y actualizar rentas",
          href: "/rentals",
          icon: FileText,
          color: "bg-purple-500",
        },
      )
    }

    if (userRole === "encargado") {
      baseItems.push(
        {
          title: "Gestión de Autos",
          description: "Registrar y mantener datos de autos",
          href: "/cars",
          icon: Car,
          color: "bg-blue-500",
        },
        {
          title: "Reparaciones",
          description: "Registrar reparaciones de vehículos",
          href: "/repairs",
          icon: Wrench,
          color: "bg-orange-500",
        },
        {
          title: "Devoluciones",
          description: "Registrar devoluciones de autos",
          href: "/returns",
          icon: FileText,
          color: "bg-green-500",
        },
        {
          title: "Reportes de Rentas",
          description: "Consultar autos más rentados",
          href: "/reports/rentals",
          icon: TrendingUp,
          color: "bg-purple-500",
        },
        {
          title: "Alertas",
          description: "Vehículos en mal estado",
          href: "/alerts",
          icon: AlertTriangle,
          color: "bg-red-500",
        },
      )
    }

    if (userRole === "dueno") {
      baseItems.push(
        {
          title: "Reportes de Reparaciones",
          description: "Consultar reparaciones por periodo",
          href: "/reports/repairs",
          icon: Calendar,
          color: "bg-indigo-500",
        },
        {
          title: "Análisis Financiero",
          description: "Reportes de ingresos y gastos",
          href: "/reports/financial",
          icon: DollarSign,
          color: "bg-green-500",
        },
      )
    }

    return baseItems
  }

  if (!userRole) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Sistema de Renta de Autos</h1>
                <p className="text-sm text-gray-500">Bienvenido, {username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{getRoleDisplay(userRole)}</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Autos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCars}</p>
                </div>
                <Car className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rentas Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeRentals}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.alerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getMenuItems().map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
