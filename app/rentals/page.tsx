"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search,
  Edit,
  Calendar,
  Car,
  User,
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Cliente {
  _id: string
  nombre: string
  correo: string
  telefono: string
  activo: boolean
}

interface Auto {
  _id: string
  marca: string
  modelo: string
  placas: string
  disponible: boolean
  categoria: string
}

interface Renta {
  _id: string
  cliente_id: string
  auto_id: string
  fecha_inicio: string
  fecha_fin: string
  precio_total: number
  estatus: string
  cliente?: {
    nombre: string
    correo: string
    telefono: string
  }
  auto?: {
    marca: string
    modelo: string
    placas: string
    categoria: string
  }
}

export default function RentalsPage() {
  const [rentas, setRentas] = useState<Renta[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [autos, setAutos] = useState<Auto[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingRenta, setEditingRenta] = useState<Renta | null>(null)
  const [formData, setFormData] = useState({
    cliente_id: '',
    auto_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    precio_total: '',
    estatus: 'activa'
  })

  // Cargar datos
  const fetchData = async () => {
    setLoading(true)
    try {
      // Cargar rentas
      const rentasResponse = await fetch('/api/rentas')
      const rentasData = await rentasResponse.json()
      
      // Cargar clientes
      const clientesResponse = await fetch('/api/clientes')
      const clientesData = await clientesResponse.json()
      
      // Cargar autos
      const autosResponse = await fetch('/api/autos')
      const autosData = await autosResponse.json()

      if (rentasData.success && clientesData.success && autosData.success) {
        setRentas(rentasData.rentas || [])
        setClientes(clientesData.clientes || [])
        setAutos(autosData.autos || [])
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Crear nueva renta
  const handleCreateRenta = async () => {
    try {
      const response = await fetch('/api/rentas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        alert('Renta creada exitosamente')
        setShowForm(false)
        setFormData({
          cliente_id: '',
          auto_id: '',
          fecha_inicio: '',
          fecha_fin: '',
          precio_total: '',
          estatus: 'activa'
        })
        fetchData()
      } else {
        alert(data.error || 'Error creando renta')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    }
  }

  // Actualizar renta
  const handleUpdateRenta = async () => {
    if (!editingRenta) return

    try {
      const response = await fetch(`/api/rentas/${editingRenta._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        alert('Renta actualizada exitosamente')
        setShowForm(false)
        setEditingRenta(null)
        setFormData({
          cliente_id: '',
          auto_id: '',
          fecha_inicio: '',
          fecha_fin: '',
          precio_total: '',
          estatus: 'activa'
        })
        fetchData()
      } else {
        alert(data.error || 'Error actualizando renta')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    }
  }

  // Abrir formulario de edición
  const openEditForm = (renta: Renta) => {
    setEditingRenta(renta)
    setFormData({
      cliente_id: renta.cliente_id,
      auto_id: renta.auto_id,
      fecha_inicio: renta.fecha_inicio.split('T')[0],
      fecha_fin: renta.fecha_fin.split('T')[0],
      precio_total: renta.precio_total.toString(),
      estatus: renta.estatus
    })
    setShowForm(true)
  }

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Formatear precio
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(precio)
  }

  // Obtener color del estatus
  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'activa':
        return 'bg-green-100 text-green-800'
      case 'finalizada':
        return 'bg-blue-100 text-blue-800'
      case 'cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Obtener autos disponibles
  const autosDisponibles = autos.filter(auto => auto.disponible)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Rentas
              </h1>
              <p className="text-gray-600">
                Registrar y actualizar rentas de vehículos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Renta
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingRenta ? 'Editar Renta' : 'Nueva Renta'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingRenta ? 'Actualiza los datos de la renta' : 'Registra una nueva renta de vehículo'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cliente_id">Cliente</Label>
                      <Select value={formData.cliente_id} onValueChange={(value) => setFormData({...formData, cliente_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientes.filter(cliente => cliente.activo).map((cliente) => (
                            <SelectItem key={cliente._id} value={cliente._id}>
                              {cliente.nombre} - {cliente.correo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="auto_id">Vehículo</Label>
                      <Select value={formData.auto_id} onValueChange={(value) => setFormData({...formData, auto_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar vehículo" />
                        </SelectTrigger>
                        <SelectContent>
                          {autosDisponibles.map((auto) => (
                            <SelectItem key={auto._id} value={auto._id}>
                              {auto.marca} {auto.modelo} ({auto.placas})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                      <Input
                        id="fecha_inicio"
                        type="date"
                        value={formData.fecha_inicio}
                        onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fecha_fin">Fecha de Fin</Label>
                      <Input
                        id="fecha_fin"
                        type="date"
                        value={formData.fecha_fin}
                        onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="precio_total">Precio Total</Label>
                      <Input
                        id="precio_total"
                        type="number"
                        placeholder="0.00"
                        value={formData.precio_total}
                        onChange={(e) => setFormData({...formData, precio_total: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="estatus">Estatus</Label>
                      <Select value={formData.estatus} onValueChange={(value) => setFormData({...formData, estatus: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activa">Activa</SelectItem>
                          <SelectItem value="finalizada">Finalizada</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={editingRenta ? handleUpdateRenta : handleCreateRenta}>
                      {editingRenta ? 'Actualizar' : 'Crear'} Renta
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={() => window.history.back()}>
                Volver
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resumen */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{rentas.length}</div>
                <div className="text-sm text-gray-600">Total de rentas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {rentas.filter(renta => renta.estatus === 'activa').length}
                </div>
                <div className="text-sm text-gray-600">Rentas activas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {rentas.filter(renta => renta.estatus === 'finalizada').length}
                </div>
                <div className="text-sm text-gray-600">Rentas finalizadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {rentas.filter(renta => renta.estatus === 'cancelada').length}
                </div>
                <div className="text-sm text-gray-600">Rentas canceladas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de rentas */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">Cargando rentas...</div>
              </CardContent>
            </Card>
          ) : rentas.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  No hay rentas registradas
                </div>
              </CardContent>
            </Card>
          ) : (
            rentas.map((renta) => (
              <Card key={renta._id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Renta #{renta._id.slice(-6)}
                        </h3>
                        <Badge className={getEstatusColor(renta.estatus)}>
                          {renta.estatus}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatearPrecio(renta.precio_total)}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p><strong>Cliente:</strong> {renta.cliente?.nombre || 'Cliente no encontrado'}</p>
                        <p><strong>Vehículo:</strong> {renta.auto ? `${renta.auto.marca} ${renta.auto.modelo} (${renta.auto.placas})` : 'Vehículo no encontrado'}</p>
                        <p><strong>Período:</strong> {formatearFecha(renta.fecha_inicio)} - {formatearFecha(renta.fecha_fin)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(renta)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
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
