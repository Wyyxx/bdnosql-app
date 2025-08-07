# 🚗 Sistema de Gestión de Renta de Autos

Sistema completo de gestión para una empresa de renta de autos con roles de empleado, encargado y dueño.

## 📋 Características

### 👥 **Roles de Usuario:**
- **Empleado**: Gestión de clientes, búsqueda de vehículos, registro de rentas
- **Encargado**: Gestión de autos, reparaciones, devoluciones, alertas
- **Dueño**: Consultas financieras, reportes, gestión de reparaciones

### 🔧 **Funcionalidades Principales:**
- ✅ Sistema de autenticación por roles
- ✅ Gestión completa de clientes
- ✅ Gestión de vehículos y disponibilidad
- ✅ Registro y seguimiento de rentas
- ✅ Sistema de devoluciones con alertas
- ✅ Gestión de reparaciones
- ✅ Notificaciones en tiempo real
- ✅ Reportes financieros
- ✅ Dashboard interactivo por rol

## 📁 **Estructura del Proyecto:**

```
bdnosql-app/
├── app/                    # Páginas y APIs de Next.js
│   ├── api/               # APIs del backend
│   ├── dashboard/         # Dashboards por rol
│   ├── cars/             # Gestión de vehículos
│   ├── clients/          # Gestión de clientes
│   ├── rentals/          # Gestión de rentas
│   ├── returns/          # Gestión de devoluciones
│   ├── repairs/          # Gestión de reparaciones
│   └── alerts/           # Sistema de alertas
├── components/            # Componentes reutilizables
├── lib/                  # Utilidades y helpers
├── scripts/              # Scripts de configuración
└── public/               # Archivos estáticos
```
