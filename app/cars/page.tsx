"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  RefreshCw
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function CarsPage() {
  const [autos, setAutos] = useState<Auto[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDisponible, setFilterDisponible] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingAuto, setEditingAuto] = useState<Auto | null>(null)
  const [deletingAuto, setDeletingAuto] = useState<Auto | null>(null)
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    año: "",
    placas: "",
    disponible: true,
    kilometraje: "",
    categoria: ""
  })

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
        setAutos(data.autos)
      }
    } catch (error) {
      console.error('Error cargando autos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAutos()
  }, [searchTerm, filterDisponible])

  // Crear nuevo auto
  const handleCreateAuto = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/autos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setShowForm(false)
        setFormData({ marca: "", modelo: "", año: "", placas: "", disponible: true, kilometraje: "", categoria: "" })
        fetchAutos()
      } else {
        alert(data.error || 'Error creando auto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    }
  }

  // Actualizar auto
  const handleUpdateAuto = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingAuto) return

    try {
      const response = await fetch(`/api/autos/${editingAuto._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setEditingAuto(null)
        setFormData({ marca: "", modelo: "", año: "", placas: "", disponible: true, kilometraje: "", categoria: "" })
        fetchAutos()
      } else {
        alert(data.error || 'Error actualizando auto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    }
  }

  // Eliminar auto (eliminación física)
  const handleDeleteAuto = async () => {
    if (!deletingAuto) return

    try {
      const response = await fetch(`/api/autos/${deletingAuto._id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        setDeletingAuto(null)
        fetchAutos()
      } else {
        alert(data.error || 'Error eliminando auto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    }
  }

  // Abrir formulario de edición
  const openEditForm = (auto: Auto) => {
    setEditingAuto(auto)
    setFormData({
      marca: auto.marca,
      modelo: auto.modelo,
      año: auto.año.toString(),
      placas: auto.placas,
      disponible: auto.disponible,
      kilometraje: auto.kilometraje.toString(),
      categoria: auto.categoria
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
                Gestión de Autos
              </h1>
              <p className="text-gray-600">
                Administra el registro de autos del sistema
              </p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Auto
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y búsqueda */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por marca, modelo, placas o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterDisponible}
                  onChange={(e) => setFilterDisponible(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filtrar por disponibilidad"
                >
                  <option value="all">Todos los autos</option>
                  <option value="true">Solo disponibles</option>
                  <option value="false">Solo no disponibles</option>
                </select>
                <Button variant="outline" onClick={fetchAutos}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de autos */}
        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">Cargando autos...</div>
              </CardContent>
            </Card>
          ) : autos.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  No se encontraron autos
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
                          {auto.marca} {auto.modelo}
                        </h3>
                        <Badge className={
                          auto.disponible 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }>
                          {auto.disponible ? "Disponible" : "No Disponible"}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p><strong>Placas:</strong> {auto.placas}</p>
                        <p><strong>Año:</strong> {auto.año}</p>
                        <p><strong>Categoría:</strong> {auto.categoria}</p>
                        <p><strong>Kilometraje:</strong> {auto.kilometraje.toLocaleString()} km</p>
                        <p><strong>Fecha de ingreso:</strong> {new Date(auto.fecha_ingreso).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditForm(auto)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeletingAuto(auto)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar auto?</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que quieres eliminar permanentemente el auto{" "}
                              <span className="font-semibold text-red-600">"{auto.marca} {auto.modelo}"</span>?
                              <br />
                              <br />
                              <span className="text-red-600 font-medium">⚠️ Esta acción no se puede deshacer.</span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAuto}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal para crear/editar auto */}
      <Dialog open={showForm || editingAuto !== null} onOpenChange={() => {
        setShowForm(false)
        setEditingAuto(null)
        setFormData({ marca: "", modelo: "", año: "", placas: "", disponible: true, kilometraje: "", categoria: "" })
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingAuto ? "Editar Auto" : "Nuevo Auto"}
            </DialogTitle>
            <DialogDescription>
              {editingAuto 
                ? "Modifica los datos del auto seleccionado"
                : "Completa los datos para registrar un nuevo auto"
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editingAuto ? handleUpdateAuto : handleCreateAuto} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="año">Año</Label>
                <Input
                  id="año"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.año}
                  onChange={(e) => setFormData({ ...formData, año: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="placas">Placas</Label>
                <Input
                  id="placas"
                  value={formData.placas}
                  onChange={(e) => setFormData({ ...formData, placas: e.target.value.toUpperCase() })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kilometraje">Kilometraje</Label>
                <Input
                  id="kilometraje"
                  type="number"
                  min="0"
                  value={formData.kilometraje}
                  onChange={(e) => setFormData({ ...formData, kilometraje: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoría</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedán">Sedán</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="Deportivo">Deportivo</SelectItem>
                    <SelectItem value="Lujo">Lujo</SelectItem>
                    <SelectItem value="Económico">Económico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {editingAuto && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="disponible"
                  checked={formData.disponible}
                  onCheckedChange={(checked) => setFormData({ ...formData, disponible: checked })}
                />
                <Label htmlFor="disponible" className={`text-sm font-medium ${formData.disponible ? 'text-green-600' : 'text-red-600'}`}>
                  {formData.disponible ? "Auto Disponible" : "Auto No Disponible"}
                </Label>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingAuto(null)
                  setFormData({ marca: "", modelo: "", año: "", placas: "", disponible: true, kilometraje: "", categoria: "" })
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingAuto ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
