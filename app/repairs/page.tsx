"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Wrench, 
  Plus, 
  Search, 
  Edit, 
  Car,
  Filter,
  RefreshCw,
  DollarSign
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Auto {
  _id: string
  marca: string
  modelo: string
  año: number
  placas: string
}

interface Reparacion {
  _id: string
  auto_id: string
  descripcion: string
  costo: number
  fecha: string
  taller: string
  auto?: Auto // Para mostrar información del auto
}

export default function RepairsPage() {
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([])
  const [autos, setAutos] = useState<Auto[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAuto, setFilterAuto] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingReparacion, setEditingReparacion] = useState<Reparacion | null>(null)
  const [formData, setFormData] = useState({
    auto_id: "",
    descripcion: "",
    costo: "",
    fecha: "",
    taller: ""
  })

  // Cargar reparaciones y autos
  const fetchReparaciones = async () => {
    setLoading(true)
    try {
      let url = '/api/reparaciones'
      const params = new URLSearchParams()
      
      if (filterAuto !== "all") {
        params.append('auto_id', filterAuto)
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
        setReparaciones(data.reparaciones)
      }
    } catch (error) {
      console.error('Error cargando reparaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAutos = async () => {
    try {
      const response = await fetch('/api/autos')
      const data = await response.json()
      
      if (data.success) {
        setAutos(data.autos)
      }
    } catch (error) {
      console.error('Error cargando autos:', error)
    }
  }

  useEffect(() => {
    fetchAutos()
  }, [])

  useEffect(() => {
    fetchReparaciones()
  }, [searchTerm, filterAuto])

  // Crear nueva reparación
  const handleCreateReparacion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/reparaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setShowForm(false)
        setFormData({ auto_id: "", descripcion: "", costo: "", fecha: "", taller: "" })
        fetchReparaciones()
      } else {
        alert(data.error || 'Error creando reparación')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    }
  }

  // Actualizar reparación
  const handleUpdateReparacion = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingReparacion) return

    try {
      const response = await fetch(`/api/reparaciones/${editingReparacion._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setEditingReparacion(null)
        setFormData({ auto_id: "", descripcion: "", costo: "", fecha: "", taller: "" })
        fetchReparaciones()
    } else {
        alert(data.error || 'Error actualizando reparación')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    }
  }

  // Abrir formulario de edición
  const openEditForm = (reparacion: Reparacion) => {
    setEditingReparacion(reparacion)
    setFormData({
      auto_id: reparacion.auto_id,
      descripcion: reparacion.descripcion,
      costo: reparacion.costo.toString(),
      fecha: reparacion.fecha.split('T')[0], // Convertir a formato YYYY-MM-DD
      taller: reparacion.taller
    })
  }

  // Obtener información del auto
  const getAutoInfo = (auto_id: string) => {
    return autos.find(auto => auto._id === auto_id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Reparaciones
              </h1>
              <p className="text-gray-600">
                Registra y mantiene el historial de reparaciones de los autos
              </p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Reparación
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
                    placeholder="Buscar por descripción o taller..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterAuto}
                  onChange={(e) => setFilterAuto(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filtrar por auto"
                >
                  <option value="all">Todos los autos</option>
                  {autos.map((auto) => (
                    <option key={auto._id} value={auto._id}>
                      {auto.marca} {auto.modelo} ({auto.placas})
                    </option>
                  ))}
                </select>
                <Button variant="outline" onClick={fetchReparaciones}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de reparaciones */}
        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">Cargando reparaciones...</div>
              </CardContent>
            </Card>
          ) : reparaciones.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  No se encontraron reparaciones
                </div>
              </CardContent>
            </Card>
          ) : (
            reparaciones.map((reparacion) => {
              const autoInfo = getAutoInfo(reparacion.auto_id)
              return (
                <Card key={reparacion._id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {reparacion.descripcion}
                          </h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            ${reparacion.costo.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p><strong>Auto:</strong> {autoInfo ? `${autoInfo.marca} ${autoInfo.modelo} (${autoInfo.placas})` : 'Auto no encontrado'}</p>
                          <p><strong>Taller:</strong> {reparacion.taller}</p>
                          <p><strong>Fecha:</strong> {new Date(reparacion.fecha).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
              <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditForm(reparacion)}
                        >
                          <Edit className="w-4 h-4" />
              </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>

      {/* Modal para crear/editar reparación */}
      <Dialog open={showForm || editingReparacion !== null} onOpenChange={() => {
        setShowForm(false)
        setEditingReparacion(null)
        setFormData({ auto_id: "", descripcion: "", costo: "", fecha: "", taller: "" })
      }}>
        <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
            <DialogTitle>
              {editingReparacion ? "Editar Reparación" : "Nueva Reparación"}
            </DialogTitle>
                <DialogDescription>
              {editingReparacion 
                ? "Modifica los datos de la reparación seleccionada"
                : "Completa los datos para registrar una nueva reparación"
              }
                </DialogDescription>
              </DialogHeader>
          <form onSubmit={editingReparacion ? handleUpdateReparacion : handleCreateReparacion} className="space-y-4">
            <div>
              <Label htmlFor="auto_id">Auto</Label>
              <Select value={formData.auto_id} onValueChange={(value) => setFormData({ ...formData, auto_id: value })}>
                      <SelectTrigger>
                  <SelectValue placeholder="Seleccionar auto" />
                      </SelectTrigger>
                      <SelectContent>
                  {autos.map((auto) => (
                    <SelectItem key={auto._id} value={auto._id}>
                      {auto.marca} {auto.modelo} ({auto.placas})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
            <div>
              <Label htmlFor="descripcion">Descripción de la reparación</Label>
                      <Input
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="costo">Costo</Label>
                      <Input
                  id="costo"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costo}
                  onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                        required
                      />
                    </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                      <Input
                  id="fecha"
                        type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                      />
                    </div>
                  </div>
            <div>
                      <Label htmlFor="taller">Taller</Label>
                      <Input
                        id="taller"
                value={formData.taller}
                        onChange={(e) => setFormData({ ...formData, taller: e.target.value })}
                required
                      />
                    </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingReparacion(null)
                  setFormData({ auto_id: "", descripcion: "", costo: "", fecha: "", taller: "" })
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingReparacion ? "Actualizar" : "Crear"}
              </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
    </div>
  )
}
