"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Car, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Plus,
  Search
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
  _id: string
  fecha_inicio: string
  fecha_fin: string
  precio_total: number
  estatus: string
  auto_id: string
  cliente: {
    nombre: string
    correo: string
  }
  auto?: {
    marca: string
    modelo: string
    placas: string
    categoria: string
  }
}

interface Devolucion {
  _id: string
  renta_id: string
  auto_id: string
  fecha_devolucion: string
  estado_vehiculo: string
  observaciones: string
  recibido_por: string
  fecha_registro: string
  auto?: Auto
  renta?: Renta
}

export default function ReturnsPage() {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([])
  const [rentas, setRentas] = useState<Renta[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [currentUser, setCurrentUser] = useState<string>('')
  const [formData, setFormData] = useState({
    renta_id: '',
    auto_id: '',
    fecha_devolucion: '',
    estado_vehiculo: '',
    observaciones: '',
    recibido_por: ''
  })

  useEffect(() => {
    // Obtener información del usuario actual
    const username = localStorage.getItem("username")
    setCurrentUser(username || '')
    
    // Obtener fecha y hora actual en formato datetime-local
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`
    
    // Establecer el usuario actual como recibido_por por defecto y fecha actual
    if (username) {
      setFormData(prev => ({
        ...prev,
        recibido_por: username,
        fecha_devolucion: currentDateTime
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        fecha_devolucion: currentDateTime
      }))
    }
    
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Obtener devoluciones
      const devolucionesResponse = await fetch('/api/devoluciones')
      const devolucionesData = await devolucionesResponse.json()

      // Obtener rentas activas
      const rentasResponse = await fetch('/api/rentas?estatus=activa')
      const rentasData = await rentasResponse.json()

      if (devolucionesData.success) {
        setDevoluciones(devolucionesData.devoluciones)
      }

      if (rentasData.success) {
        setRentas(rentasData.rentas)
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDevolucion = async () => {
    try {
      const response = await fetch('/api/devoluciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        alert('Devolución registrada exitosamente')
        setShowForm(false)
        // Obtener fecha y hora actual para el reset
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`
        
        setFormData({
          renta_id: '',
          auto_id: '',
          fecha_devolucion: currentDateTime,
          estado_vehiculo: '',
          observaciones: '',
          recibido_por: currentUser || ''
        })
        fetchData()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creando devolución:', error)
      alert('Error al crear la devolución')
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES')
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'excelente':
        return 'bg-green-100 text-green-800'
      case 'bueno':
        return 'bg-blue-100 text-blue-800'
      case 'regular':
        return 'bg-yellow-100 text-yellow-800'
      case 'malo':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'excelente':
        return <CheckCircle className="w-4 h-4" />
      case 'bueno':
        return <CheckCircle className="w-4 h-4" />
      case 'regular':
        return <AlertTriangle className="w-4 h-4" />
      case 'malo':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const filteredDevoluciones = devoluciones.filter(devolucion => {
    const matchesSearch = searchTerm === '' || 
      devolucion.auto?.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devolucion.auto?.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devolucion.auto?.placas?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstado = filterEstado === '' || filterEstado === 'todos' || devolucion.estado_vehiculo === filterEstado
    
    return matchesSearch && matchesEstado
  })

  const rentasActivas = rentas.filter(renta => renta.estatus === 'activa')

  const resetForm = () => {
    // Obtener fecha y hora actual en formato datetime-local
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`
    
    setFormData({
      renta_id: '',
      auto_id: '',
      fecha_devolucion: currentDateTime,
      estado_vehiculo: '',
      observaciones: '',
      recibido_por: currentUser || ''
    })
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
                  Gestión de Devoluciones
                </h1>
                <p className="text-gray-600">
                  Recibir vehículos y verificar su estado
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Car className="w-6 h-6 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Encargado
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
                <div className="p-2 rounded-lg bg-blue-100">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Devoluciones</p>
                  <p className="text-2xl font-bold text-gray-900">{devoluciones.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">En Buen Estado</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {devoluciones.filter(d => ['excelente', 'bueno'].includes(d.estado_vehiculo)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estado Regular</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {devoluciones.filter(d => d.estado_vehiculo === 'regular').length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Mal Estado</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {devoluciones.filter(d => d.estado_vehiculo === 'malo').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por marca, modelo o placas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="excelente">Excelente</SelectItem>
                <SelectItem value="bueno">Bueno</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="malo">Malo</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={showForm} onOpenChange={(open) => {
              setShowForm(open)
              if (open) {
                resetForm()
              }
            }}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  Nueva Devolución
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Registrar Devolución</DialogTitle>
                  <DialogDescription>
                    Recibir un vehículo y verificar su estado
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="renta_id">Renta</Label>
                      <Select 
                        value={formData.renta_id} 
                        onValueChange={(value) => {
                          const renta = rentasActivas.find(r => r._id === value)
                          setFormData({
                            ...formData,
                            renta_id: value,
                            auto_id: renta?.auto_id || ''
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar renta" />
                        </SelectTrigger>
                        <SelectContent>
                          {rentasActivas.map((renta) => (
                            <SelectItem key={renta._id} value={renta._id}>
                              {renta.auto?.marca} {renta.auto?.modelo} - {renta.cliente?.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fecha_devolucion">Fecha de Devolución</Label>
                      <Input
                        id="fecha_devolucion"
                        type="datetime-local"
                        value={formData.fecha_devolucion}
                        onChange={(e) => setFormData({...formData, fecha_devolucion: e.target.value})}
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Fecha y hora actual pre-llenada
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estado_vehiculo">Estado del Vehículo</Label>
                      <Select 
                        value={formData.estado_vehiculo} 
                        onValueChange={(value) => setFormData({...formData, estado_vehiculo: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="malo">Malo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="recibido_por">Recibido Por</Label>
                      <Input
                        id="recibido_por"
                        value={formData.recibido_por}
                        onChange={(e) => setFormData({...formData, recibido_por: e.target.value})}
                        placeholder="Nombre del encargado"
                        className="bg-gray-50"
                      />
                      {currentUser && (
                        <p className="text-xs text-gray-500 mt-1">
                          Usuario actual: {currentUser}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                      id="observaciones"
                      value={formData.observaciones}
                      onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                      placeholder="Detalles sobre el estado del vehículo..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateDevolucion}>
                    Registrar Devolución
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Lista de devoluciones */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando devoluciones...</p>
            </div>
          ) : filteredDevoluciones.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay devoluciones registradas
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || filterEstado ? 'No se encontraron devoluciones con los filtros aplicados' : 'Comienza registrando la primera devolución'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredDevoluciones.map((devolucion) => (
              <Card key={devolucion._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getEstadoIcon(devolucion.estado_vehiculo)}
                        <Badge className={getEstadoColor(devolucion.estado_vehiculo)}>
                          {devolucion.estado_vehiculo.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {devolucion.auto?.marca} {devolucion.auto?.modelo}
                        </CardTitle>
                        <CardDescription>
                          Placas: {devolucion.auto?.placas} • Recibido por: {devolucion.recibido_por}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {formatearFecha(devolucion.fecha_devolucion)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Información de la Renta</h4>
                      {devolucion.renta ? (
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Cliente:</span> {devolucion.renta.cliente?.nombre}</p>
                          <p><span className="font-medium">Período:</span> {formatearFecha(devolucion.renta.fecha_inicio)} - {formatearFecha(devolucion.renta.fecha_fin)}</p>
                          <p><span className="font-medium">Precio:</span> ${devolucion.renta.precio_total?.toLocaleString()}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Información de renta no disponible</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Observaciones</h4>
                      <p className="text-sm text-gray-600">
                        {devolucion.observaciones || 'Sin observaciones'}
                      </p>
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
