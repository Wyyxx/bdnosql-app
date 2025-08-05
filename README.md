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

## 🚀 Instalación y Configuración

### **Prerrequisitos:**
- Node.js 18+ 
- npm, yarn, o pnpm
- MongoDB Atlas (cuenta gratuita)

### **1. Clonar el Repositorio:**
```bash
git clone <URL_DEL_REPOSITORIO>
cd bdnosql-app
```

### **2. Instalar Dependencias:**
```bash
npm install
# o
yarn install
# o
pnpm install
```

### **3. Configurar Variables de Entorno:**
Crear un archivo `.env.local` en la raíz del proyecto:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://Admon:aGfVRAQ9dwEwNpSi@escuela.rr7gjjr.mongodb.net/

# Next.js
NEXTAUTH_SECRET=tu_secret_key_aqui
NEXTAUTH_URL=http://localhost:3000
```

### **5. Ejecutar Scripts de Configuración:**

#### **Configurar Variables de Entorno:**
```bash
node scripts/setup-env.js
```

#### **Probar Conexión a la Base de Datos:**
```bash
node scripts/test-db.js
```

#### **Crear Datos de Prueba:**
```bash
# Crear usuarios de prueba
node scripts/test-users.js

# Crear autos de prueba
node scripts/test-autos.js

# Crear clientes de prueba
node scripts/test-clientes.js

# Crear rentas de prueba
node scripts/test-rentas.js

# Crear reparaciones de prueba
node scripts/test-reparaciones.js

# Crear devoluciones y alertas de prueba
node scripts/test-devoluciones-alertas.js

# Crear notificaciones de prueba
node scripts/test-notificaciones.js
```

### **6. Ejecutar el Proyecto:**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```


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
