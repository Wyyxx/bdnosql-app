"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Usuario {
  _id: string
  nombre: string
  correo: string
  rol: string
  activo: boolean
}

export default function DebugUsers() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/users')
      const data = await response.json()
      
      if (data.success) {
        setUsuarios(data.usuarios)
      }
    } catch (error) {
      console.error('Error obteniendo usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-lg">👥 Usuarios Disponibles (Debug)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <div className="space-y-2">
            {usuarios.map((usuario, index) => (
              <div key={usuario._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{usuario.nombre}</p>
                  <p className="text-sm text-gray-600">{usuario.correo}</p>
                  <p className="text-xs text-gray-500">Rol: {usuario.rol}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded ${
                    usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))}
            {usuarios.length === 0 && (
              <p className="text-gray-500 text-center">No se encontraron usuarios</p>
            )}
          </div>
        )}
        <Button onClick={fetchUsers} className="mt-4" variant="outline">
          Actualizar Lista
        </Button>
      </CardContent>
    </Card>
  )
} 