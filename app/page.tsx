"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Users, Wrench } from "lucide-react"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "",
  })

  // TODO: Implementar autenticación con MongoDB
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", credentials)
    // Aquí irá la lógica de autenticación con MongoDB
    // Ejemplo: const user = await authenticateUser(credentials)

    // Simulación de login exitoso
    if (credentials.username && credentials.password && credentials.role) {
      localStorage.setItem("userRole", credentials.role)
      localStorage.setItem("username", credentials.username)
      window.location.href = "/dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={credentials.role}
                onValueChange={(value) => setCredentials({ ...credentials, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empleado">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Empleado Atención al Público
                    </div>
                  </SelectItem>
                  <SelectItem value="encargado">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Encargado de Autos
                    </div>
                  </SelectItem>
                  <SelectItem value="dueno">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Dueño
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
