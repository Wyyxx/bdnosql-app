"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Car,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react"
import { Label } from "@/components/ui/label"

interface Auto {
  _id: string
  marca: string
  modelo: string
  año: number
  placas: string
  disponible: boolean
  kilometraje: number
  categoria: string
  fecha_ingreso: string
}

export default function CarSearchPage() {
  const [autos, setAutos] = useState<Auto[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDisponible, setFilterDisponible] = useState<string>("all")
  const [filterCategoria, setFilterCategoria] = useState<string>("all")

  // Cargar autos
  const fetchAutos = async () => {
    setLoading(true)
    try {
      let url = '/api/autos'
      const params = new URLSearchParams()
      
      if (filterDisponible !== "all") {
        params.append('disponible', filterDisponible)
      }
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        let autosFiltrados = data.autos

        // Filtrar por categoría si está seleccionada
        if (filterCategoria !== "all") {
          autosFiltrados = autosFiltrados.filter((auto: Auto) => 
            auto.categoria.toLowerCase() === filterCategoria.toLowerCase()
          )
        }

        setAutos(autosFiltrados)
      }
    } catch (error) {
      console.error('Error cargando autos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAutos()
  }, [searchTerm, filterDisponible, filterCategoria])

  // Obtener categorías únicas
  const categorias = Array.from(new Set(autos.map(auto => auto.categoria)))

  // Formatear kilometraje
  const formatearKilometraje = (km: number) => {
    return km.toLocaleString('es-MX')
  }

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Búsqueda de Vehículos
              </h1>
              <p className="text-gray-600">
                Consulta vehículos disponibles para renta
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
        {/* Filtros y búsqueda */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar vehículo</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Marca, modelo o placas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
                             <div>
                 <Label htmlFor="disponible">Estado</Label>
                 <select
                   id="disponible"
                   value={filterDisponible}
                   onChange={(e) => setFilterDisponible(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   aria-label="Filtrar por estado"
                 >
                   <option value="all">Todos los estados</option>
                   <option value="true">Disponible</option>
                   <option value="false">No disponible</option>
                 </select>
               </div>
               <div>
                 <Label htmlFor="categoria">Categoría</Label>
                 <select
                   id="categoria"
                   value={filterCategoria}
                   onChange={(e) => setFilterCategoria(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   aria-label="Filtrar por categoría"
                 >
                   <option value="all">Todas las categorías</option>
                   {categorias.map((categoria) => (
                     <option key={categoria} value={categoria}>
                       {categoria}
                     </option>
                   ))}
                 </select>
               </div>
              <div className="flex items-end">
                <Button onClick={fetchAutos} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{autos.length}</div>
                <div className="text-sm text-gray-600">Total de vehículos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {autos.filter(auto => auto.disponible).length}
                </div>
                <div className="text-sm text-gray-600">Disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {autos.filter(auto => !auto.disponible).length}
                </div>
                <div className="text-sm text-gray-600">No disponibles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de vehículos */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">Buscando vehículos...</div>
              </CardContent>
            </Card>
          ) : autos.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  No se encontraron vehículos con los filtros aplicados
                </div>
              </CardContent>
            </Card>
          ) : (
            autos.map((auto) => (
              <Card key={auto._id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {auto.marca} {auto.modelo} {auto.año}
                        </h3>
                        <Badge className={
                          auto.disponible 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }>
                          {auto.disponible ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Disponible
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              No disponible
                            </>
                          )}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {auto.categoria}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p><strong>Placas:</strong> {auto.placas}</p>
                        <p><strong>Kilometraje:</strong> {formatearKilometraje(auto.kilometraje)} km</p>
                        <p><strong>Fecha de ingreso:</strong> {formatearFecha(auto.fecha_ingreso)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">ID del vehículo</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {auto._id.slice(-8)}
                        </p>
                      </div>
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
