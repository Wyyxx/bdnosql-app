"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Client {
  _id?: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  licencia: string
  fechaRegistro: string
  estado: "activo" | "inactivo"
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState<Client>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    licencia: "",
    fechaRegistro: new Date().toISOString().split("T")[0],
    estado: "activo",
  })

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const res = await fetch("/api/clientes")
      if (!res.ok) throw new Error("Error al cargar clientes desde la API")

      const data = await res.json()

      const formattedClients: Client[] = data.map((client: any) => ({
        _id: client._id,
        nombre: client.nombre || "",
        apellido: client.apellido || "",
        email: client.correo || "",
        telefono: client.telefono || "",
        direccion: client.direccion || "",
        licencia: client.licencia || "",
        fechaRegistro: client.fecha_registro || new Date().toISOString(),
        estado: client.activo ? "activo" : "inactivo",
      }))

      setClients(formattedClients)
    } catch (error) {
      console.error("Error cargando clientes:", error)
    }
  }

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingClient) {
      console.log("Actualizando cliente:", formData)
      // Implementar update si deseas
    } else {
      console.log("Creando nuevo cliente:", formData)
      // Implementar POST si deseas
    }

    await loadClients()
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      licencia: "",
      fechaRegistro: new Date().toISOString().split("T")[0],
      estado: "activo",
    })
    setEditingClient(null)
    setIsDialogOpen(false)
  }

  const handleDeleteClient = async (clientId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      console.log("Eliminando cliente:", clientId)
      // Implementar DELETE si deseas
      await loadClients()
    }
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setFormData(client)
    setIsDialogOpen(true)
  }

  const filteredClients = clients.filter(
    (client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.licencia.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
              <p className="text-gray-600">Registrar y mantener datos de clientes</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingClient(null)
                  setFormData({
                    nombre: "",
                    apellido: "",
                    email: "",
                    telefono: "",
                    direccion: "",
                    licencia: "",
                    fechaRegistro: new Date().toISOString().split("T")[0],
                    estado: "activo",
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingClient ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
                <DialogDescription>
                  {editingClient ? "Actualiza los datos del cliente" : "Ingresa los datos del nuevo cliente"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveClient}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licencia">Número de Licencia</Label>
                    <Input
                      id="licencia"
                      value={formData.licencia}
                      onChange={(e) => setFormData({ ...formData, licencia: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingClient ? "Actualizar" : "Crear"} Cliente</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, apellido, email o licencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes ({filteredClients.length})</CardTitle>
            <CardDescription>Gestiona todos los clientes registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Licencia</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client._id}>
                    <TableCell className="font-medium">{client.nombre} {client.apellido}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.telefono}</TableCell>
                    <TableCell>{client.licencia}</TableCell>
                    <TableCell>{new Date(client.fechaRegistro).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={client.estado === "activo" ? "default" : "secondary"}>
                        {client.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClient(client)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteClient(client._id!)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
