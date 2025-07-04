"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, DollarSign, Fuel, Settings } from "lucide-react"
import Link from "next/link"

interface CarSearchFilters {
  categoria: string
  precioMin: string
  precioMax: string
  combustible: string
  transmision: string
  año: string
}

const CarSearchPage = () => {
  const [availableCars, setAvailableCars] = useState<any[]>([])
  const [filteredCars, setFilteredCars] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<CarSearchFilters>({
    categoria: "all",
    precioMin: "",
    precioMax: "",
    combustible: "all",
    transmision: "all",
    año: "all",
  })

  useEffect(() => {
    loadAvailableCars()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, filters, availableCars])

  const loadAvailableCars = async () => {
    // Aquí irá la lógica para cargar vehículos disponibles desde MongoDB
    // Ejemplo: const cars = await searchAvailableCars(filters)

    // Datos simulados
    const mockCars = [
      {
        _id: "1",
        marca: "Toyota",
        modelo: "Corolla",
        año: 2022,
        color: "Blanco",
        placas: "ABC-123",
        precioPorDia: 800,
        kilometraje: 15000,
        combustible: "gasolina",
        transmision: "automatica",
        categoria: "compacto",
      },
      {
        _id: "3",
        marca: "Nissan",
        modelo: "Sentra",
        año: 2023,
        color: "Gris",
        placas: "DEF-456",
        precioPorDia: 750,
        kilometraje: 8000,
        combustible: "gasolina",
        transmision: "manual",
        categoria: "compacto",
      },
      {
        _id: "4",
        marca: "Honda",
        modelo: "CR-V",
        año: 2023,
        color: "Negro",
        placas: "GHI-789",
        precioPorDia: 1200,
        kilometraje: 12000,
        combustible: "gasolina",
        transmision: "automatica",
        categoria: "suv",
      },
      {
        _id: "5",
        marca: "Chevrolet",
        modelo: "Spark",
        año: 2021,
        color: "Rojo",
        placas: "JKL-012",
        precioPorDia: 600,
        kilometraje: 25000,
        combustible: "gasolina",
        transmision: "manual",
        categoria: "economico",
      },
    ]
    setAvailableCars(mockCars)
  }

  const applyFilters = () => {
    const filtered = availableCars.filter((car) => {
      // Filtro de búsqueda por texto
      const matchesSearch =
        car.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.placas.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtros específicos
      const matchesCategoria = filters.categoria === "all" || car.categoria === filters.categoria
      const matchesCombustible = filters.combustible === "all" || car.combustible === filters.combustible
      const matchesTransmision = filters.transmision === "all" || car.transmision === filters.transmision

      // Filtro de precio
      const matchesPrecioMin = !filters.precioMin || car.precioPorDia >= Number.parseInt(filters.precioMin)
      const matchesPrecioMax = !filters.precioMax || car.precioPorDia <= Number.parseInt(filters.precioMax)

      // Filtro de año
      const matchesAño = filters.año === "all" || car.año.toString() === filters.año

      return (
        matchesSearch &&
        matchesCategoria &&
        matchesCombustible &&
        matchesTransmision &&
        matchesPrecioMin &&
        matchesPrecioMax &&
        matchesAño
      )
    })

    setFilteredCars(filtered)
  }

  const clearFilters = () => {
    setFilters({
      categoria: "all",
      precioMin: "",
      precioMax: "",
      combustible: "all",
      transmision: "all",
      año: "all",
    })
    setSearchTerm("")
  }

  const handleSelectCar = (car: any) => {
    // Aquí se podría redirigir a la página de nueva renta con el auto preseleccionado
    console.log("Auto seleccionado para renta:", car)
    // Ejemplo: router.push(`/rentals/new?carId=${car._id}`)
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
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buscar Vehículos Disponibles</h1>
            <p className="text-gray-600">Encuentra el vehículo perfecto para tus clientes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtros */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
                <CardDescription>Refina tu búsqueda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Búsqueda por texto */}
                <div className="space-y-2">
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Marca, modelo, placas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={filters.categoria}
                    onValueChange={(value) => setFilters({ ...filters, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="economico">Económico</SelectItem>
                      <SelectItem value="compacto">Compacto</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="lujo">Lujo</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rango de precio */}
                <div className="space-y-2">
                  <Label>Precio por día ($)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Mín"
                      type="number"
                      value={filters.precioMin}
                      onChange={(e) => setFilters({ ...filters, precioMin: e.target.value })}
                    />
                    <Input
                      placeholder="Máx"
                      type="number"
                      value={filters.precioMax}
                      onChange={(e) => setFilters({ ...filters, precioMax: e.target.value })}
                    />
                  </div>
                </div>

                {/* Combustible */}
                <div className="space-y-2">
                  <Label htmlFor="combustible">Combustible</Label>
                  <Select
                    value={filters.combustible}
                    onValueChange={(value) => setFilters({ ...filters, combustible: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="gasolina">Gasolina</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electrico">Eléctrico</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Transmisión */}
                <div className="space-y-2">
                  <Label htmlFor="transmision">Transmisión</Label>
                  <Select
                    value={filters.transmision}
                    onValueChange={(value) => setFilters({ ...filters, transmision: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatica">Automática</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Año */}
                <div className="space-y-2">
                  <Label htmlFor="año">Año</Label>
                  <Select value={filters.año} onValueChange={(value) => setFilters({ ...filters, año: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los años</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                  Limpiar Filtros
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Vehículos Disponibles ({filteredCars.length})</CardTitle>
                <CardDescription>Selecciona un vehículo para proceder con la renta</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredCars.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 text-gray-400 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">No se encontraron vehículos disponibles</p>
                    <p className="text-gray-400 mt-2">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCars.map((car) => (
                      <Card key={car._id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {car.marca} {car.modelo}
                              </h3>
                              <p className="text-gray-600">
                                {car.año} - {car.color}
                              </p>
                              <p className="text-sm text-gray-500">Placas: {car.placas}</p>
                            </div>
                            <Badge className={getCategoryColor(car.categoria)}>{car.categoria}</Badge>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">Precio por día</span>
                              </div>
                              <span className="font-semibold text-green-600">${car.precioPorDia}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Fuel className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">Combustible</span>
                              </div>
                              <span className="text-sm capitalize">{car.combustible}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-purple-600" />
                                <span className="text-sm text-gray-600">Transmisión</span>
                              </div>
                              <span className="text-sm capitalize">{car.transmision}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Kilometraje</span>
                              <span className="text-sm">{car.kilometraje.toLocaleString()} km</span>
                            </div>
                          </div>

                          <Button onClick={() => handleSelectCar(car)} className="w-full">
                            Seleccionar para Renta
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarSearchPage
