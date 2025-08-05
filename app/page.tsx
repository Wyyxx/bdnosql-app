"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Users, Wrench } from "lucide-react"
import DebugUsers from "@/components/debug-users"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    correo: "",
    contraseña: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log('🔍 Intentando login con:', credentials.correo)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()
      console.log('📡 Respuesta del servidor:', data)

      if (response.ok) {
        console.log('✅ Login exitoso')
        // Guardar información del usuario en localStorage
        localStorage.setItem("userRole", data.usuario.rol)
        localStorage.setItem("username", data.usuario.nombre)
        localStorage.setItem("userEmail", data.usuario.correo)
        localStorage.setItem("userId", data.usuario._id)
        
        // También guardar en cookies para el middleware
        document.cookie = `userRole=${data.usuario.rol}; path=/`
        document.cookie = `username=${data.usuario.nombre}; path=/`
        
        // Redireccionar según el rol del usuario
        const userRole = data.usuario.rol.toLowerCase()
        let redirectUrl = "/dashboard"
        
        if (userRole === "empleado") {
          redirectUrl = "/dashboard/empleado"
        } else if (userRole === "encargado") {
          redirectUrl = "/dashboard/encargado"
        } else if (userRole === "dueño" || userRole === "dueno") {
          redirectUrl = "/dashboard/dueno"
        }
        
        console.log(`🔄 Redirigiendo a: ${redirectUrl} (Rol: ${userRole})`)
        window.location.href = redirectUrl
      } else {
        console.log('❌ Error en login:', data.error)
        setError(data.error || 'Error en el login')
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      setError('Error de conexión al servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulario de Login */}
          <div className="flex-1">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Sistema de Renta de Autos</CardTitle>
                <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="correo">Correo Electrónico</Label>
                    <Input
                      id="correo"
                      type="email"
                      placeholder="Ingresa tu correo electrónico"
                      value={credentials.correo}
                      onChange={(e) => setCredentials({ ...credentials, correo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contraseña">Contraseña</Label>
                    <Input
                      id="contraseña"
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      value={credentials.contraseña}
                      onChange={(e) => setCredentials({ ...credentials, contraseña: e.target.value })}
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Panel de Debug */}
          <div className="flex-1">
            <DebugUsers />
          </div>
        </div>
      </div>
    </div>
  )
}
