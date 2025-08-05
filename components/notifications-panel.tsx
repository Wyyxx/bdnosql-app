"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, CheckCircle, XCircle, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Notificacion {
  _id: string
  titulo: string
  mensaje: string
  tipo: string
  leida: boolean
  fecha_creacion: string
  datos_adicionales?: {
    auto_id?: string
    estado_vehiculo?: string
    devolucion_id?: string
    observaciones?: string
  }
}

interface NotificationsPanelProps {
  usuarioId: string
}

export default function NotificationsPanel({ usuarioId }: NotificationsPanelProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [showPanel, setShowPanel] = useState(false)
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0)

  useEffect(() => {
    fetchNotificaciones()
  }, [usuarioId])

  const fetchNotificaciones = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/notificaciones?usuario_email=${usuarioId}`)
      const data = await response.json()
      
      if (data.success) {
        setNotificaciones(data.notificaciones)
        const noLeidas = data.notificaciones.filter((n: Notificacion) => !n.leida).length
        setNotificacionesNoLeidas(noLeidas)
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const marcarComoLeida = async (notificacionId: string) => {
    try {
      const response = await fetch(`/api/notificaciones/${notificacionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leida: true }),
      })

      if (response.ok) {
        setNotificaciones(prev => 
          prev.map(n => 
            n._id === notificacionId 
              ? { ...n, leida: true }
              : n
          )
        )
        setNotificacionesNoLeidas(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marcando notificación como leída:', error)
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'devolucion_alerta':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Bell className="w-4 h-4 text-blue-500" />
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'devolucion_alerta':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={showPanel} onOpenChange={setShowPanel}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="w-4 h-4" />
          {notificacionesNoLeidas > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {notificacionesNoLeidas}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notificaciones</span>
            {notificacionesNoLeidas > 0 && (
              <Badge variant="destructive">
                {notificacionesNoLeidas} nueva{notificacionesNoLeidas !== 1 ? 's' : ''}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Mantente informado sobre las alertas y eventos importantes
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Cargando notificaciones...</p>
            </div>
          ) : notificaciones.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay notificaciones
              </h3>
              <p className="text-gray-600">
                Cuando haya alertas o eventos importantes, aparecerán aquí
              </p>
            </div>
          ) : (
            notificaciones.map((notificacion) => (
              <Card 
                key={notificacion._id} 
                className={`transition-all duration-200 ${
                  !notificacion.leida 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getTipoIcon(notificacion.tipo)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {notificacion.titulo}
                          </h4>
                          <Badge className={getTipoColor(notificacion.tipo)}>
                            {notificacion.tipo.replace('_', ' ')}
                          </Badge>
                          {!notificacion.leida && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Nueva
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notificacion.mensaje}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatearFecha(notificacion.fecha_creacion)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notificacion.leida && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => marcarComoLeida(notificacion._id)}
                          className="h-8 w-8 p-0"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 