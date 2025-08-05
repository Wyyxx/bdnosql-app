"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  RefreshCw
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface Cliente {
  _id: string
  nombre: string
  telefono: string
  correo: string
  direccion: string
  activo: boolean
  fecha_registro: string
}

export default function ClientsPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActivo, setFilterActivo] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
    activo: true
  })

  // Cargar clientes
  const fetchClientes = async () => {
    setLoading(true)
    try {
      let url = '/api/clientes'
      const params = new URLSearchParams()
      
      if (filterActivo !== "all") {
        params.append('activo', filterActivo)
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
        setClientes(data.clientes)
      }
    } catch (error) {
      console.error('Error cargando clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [searchTerm, filterActivo])

  // Crear nuevo cliente
  const handleCreateCliente = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

             if (response.ok) {
         setShowForm(false)
         setFormData({ nombre: "", telefono: "", correo: "", direccion: "", activo: true })
         fetchClientes()
       } else {
        alert(data.error || 'Error creando cliente')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    }
  }

  // Actualizar cliente
  const handleUpdateCliente = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingCliente) return

    try {
      const response = await fetch(`/api/clientes/${editingCliente._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

             if (response.ok) {
         setEditingCliente(null)
         setFormData({ nombre: "", telefono: "", correo: "", direccion: "", activo: true })
         fetchClientes()
       } else {
        alert(data.error || 'Error actualizando cliente')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    }
  }

  // Eliminar cliente (eliminación física)
  const handleDeleteCliente = async () => {
    if (!deletingCliente) return

    try {
      const response = await fetch(`/api/clientes/${deletingCliente._id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        setDeletingCliente(null)
        fetchClientes()
      } else {
        alert(data.error || 'Error eliminando cliente')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    }
  }

  // Abrir formulario de edición
  const openEditForm = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      correo: cliente.correo,
      direccion: cliente.direccion,
      activo: cliente.activo
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
                Gestión de Clientes
              </h1>
              <p className="text-gray-600">
                Administra los datos de los clientes del sistema
              </p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
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
                    placeholder="Buscar por nombre, correo o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
                             <div className="flex gap-2">
                 <select
                   value={filterActivo}
                   onChange={(e) => setFilterActivo(e.target.value)}
                   className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   aria-label="Filtrar por estado"
                 >
                   <option value="all">Todos los clientes</option>
                   <option value="true">Solo activos</option>
                   <option value="false">Solo inactivos</option>
                 </select>
                <Button variant="outline" onClick={fetchClientes}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de clientes */}
        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">Cargando clientes...</div>
              </CardContent>
            </Card>
          ) : clientes.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  No se encontraron clientes
                </div>
              </CardContent>
            </Card>
          ) : (
            clientes.map((cliente) => (
              <Card key={cliente._id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cliente.nombre}
                        </h3>
                        <Badge className={
                          cliente.activo 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }>
                          {cliente.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                        <p><strong>Correo:</strong> {cliente.correo}</p>
                        <p><strong>Dirección:</strong> {cliente.direccion}</p>
                        <p><strong>Fecha de registro:</strong> {new Date(cliente.fecha_registro).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditForm(cliente)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                                             <AlertDialog>
                         <AlertDialogTrigger asChild>
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => setDeletingCliente(cliente)}
                             className="text-red-600 hover:text-red-700"
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </AlertDialogTrigger>
                         <AlertDialogContent>
                           <AlertDialogHeader>
                             <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                             <AlertDialogDescription>
                               ¿Estás seguro de que quieres eliminar permanentemente al cliente{" "}
                               <span className="font-semibold text-red-600">"{cliente.nombre}"</span>?
                               <br />
                               <br />
                               <span className="text-red-600 font-medium">⚠️ Esta acción no se puede deshacer.</span>
                             </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                             <AlertDialogCancel>Cancelar</AlertDialogCancel>
                             <AlertDialogAction
                               onClick={handleDeleteCliente}
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

             {/* Modal para crear/editar cliente */}
       <Dialog open={showForm || editingCliente !== null} onOpenChange={() => {
         setShowForm(false)
         setEditingCliente(null)
         setFormData({ nombre: "", telefono: "", correo: "", direccion: "", activo: true })
       }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
            </DialogTitle>
            <DialogDescription>
              {editingCliente 
                ? "Modifica los datos del cliente seleccionado"
                : "Completa los datos para registrar un nuevo cliente"
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editingCliente ? handleUpdateCliente : handleCreateCliente} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
              />
            </div>
                         <div>
               <Label htmlFor="direccion">Dirección</Label>
               <Textarea
                 id="direccion"
                 value={formData.direccion}
                 onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                 required
               />
             </div>
                           {editingCliente && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                  />
                  <Label htmlFor="activo" className={`text-sm font-medium ${formData.activo ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.activo ? "Cliente Activo" : "Cliente Inactivo"}
                  </Label>
                </div>
              )}
             <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                                 onClick={() => {
                   setShowForm(false)
                   setEditingCliente(null)
                   setFormData({ nombre: "", telefono: "", correo: "", direccion: "", activo: true })
                 }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingCliente ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
