"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  Gauge,
  Fuel,
  Wrench,
  TrendingUp,
  RotateCcw,
  AlertTriangle
} from "lucide-react"

export default function EncargadoDashboard() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [autos, setAutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = localStorage.getItem("username")
    const userRole = localStorage.getItem("userRole")
    const userEmail = localStorage.getItem("userEmail")
    
    setUserInfo({ username, userRole, userEmail })
    fetchAutos()
  }, [])

  const fetchAutos = async () => {
    try {
      const response = await fetch('/api/autos')
      const data = await response.json()
      
      if (data.success) {
        setAutos(data.autos)
      }
    } catch (error) {
      console.error('Error cargando autos:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: "Gestionar Autos",
      description: "Registrar y mantener datos de vehículos",
      icon: Car,
      href: "/cars",
      color: "bg-blue-500"
    },
    {
      title: "Gestionar Reparaciones",
      description: "Registrar y mantener historial de reparaciones",
      icon: Wrench,
      href: "/repairs",
      color: "bg-orange-500"
    },
    {
      title: "Autos Más Rentados",
      description: "Consultar autos más rentados en los últimos 2 meses",
      icon: TrendingUp,
      href: "/cars/most-rented",
      color: "bg-purple-500"
    },
    {
      title: "Gestionar Devoluciones",
      description: "Recibir vehículos y verificar su estado",
      icon: RotateCcw,
      href: "/returns",
      color: "bg-red-500"
    },
    {
      title: "Ver Alertas",
      description: "Vehículos devueltos en mal estado",
      icon: AlertTriangle,
      href: "/alerts",
      color: "bg-orange-500"
    }
  ]

  const stats = [
    { label: "Total de Autos", value: autos.length.toString(), icon: Car, color: "text-blue-600" },
    { label: "Autos Disponibles", value: autos.filter(auto => auto.disponible).length.toString(), icon: Car, color: "text-green-600" },
    { label: "Autos No Disponibles", value: autos.filter(auto => !auto.disponible).length.toString(), icon: Car, color: "text-red-600" }
  ]

  // Función para generar datos simulados de gasolina y kilometraje
  const generateSimulatedData = (auto: any) => {
    const gasolina = Math.floor(Math.random() * 100) + 1 // 1-100%
    const kilometrajeAdicional = Math.floor(Math.random() * 50000) + 1000 // 1000-51000 km adicional
    const kilometrajeTotal = auto.kilometraje + kilometrajeAdicional
    
    return {
      gasolina,
      kilometrajeTotal
    }
  }

  const fleetStatus = autos.length > 0 ? autos.map(auto => {
    const simulatedData = generateSimulatedData(auto)
    return {
      car: `${auto.marca} ${auto.modelo} ${auto.año}`,
      status: auto.disponible ? "Disponible" : "No Disponible",
      gasolina: `${simulatedData.gasolina}%`,
      mileage: `${simulatedData.kilometrajeTotal.toLocaleString()} km`,
      color: auto.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }
  }) : [
    {
      car: "No hay autos registrados",
      status: "Sin datos",
      gasolina: "0%",
      mileage: "0 km",
      color: "bg-gray-100 text-gray-800"
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
                Panel de Encargado - Gestión de Autos
              </h1>
              <p className="text-gray-600">
                Bienvenido, {userInfo?.username} | {userInfo?.userEmail}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
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
           {stats.map((stat, index) => (
             <Card key={index}>
               <CardContent className="p-6">
                 <div className="flex items-center">
                   <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                     <stat.icon className={`w-6 h-6 ${stat.color}`} />
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                     <p className="text-2xl font-bold text-gray-900">
                       {loading ? "..." : stat.value}
                     </p>
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

                 {/* Fleet Status */}
         <div className="mb-8">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center">
                 <Car className="w-5 h-5 mr-2" />
                 Estado de la Flota
               </CardTitle>
             </CardHeader>
             <CardContent>
                                 <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-4 text-gray-500">
                        Cargando vehículos...
                      </div>
                    ) : (
                      fleetStatus.map((vehicle, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{vehicle.car}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-600">
                                <Fuel className="w-4 h-4 inline mr-1" />
                                {vehicle.gasolina}
                              </span>
                              <span className="text-sm text-gray-600">
                                <Gauge className="w-4 h-4 inline mr-1" />
                                {vehicle.mileage}
                              </span>
                            </div>
                          </div>
                          <Badge className={vehicle.color}>
                            {vehicle.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
             </CardContent>
           </Card>
         </div>
      </div>
    </div>
  )
} 