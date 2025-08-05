# Sistema de Renta de Autos - Frontend

Este es el frontend completo para el sistema de renta de autos con MongoDB Atlas. La aplicación está estructurada para facilitar la implementación de la lógica de base de datos.

## 🚀 Características Implementadas

### Módulos Principales
- **Dashboard** - Panel principal con estadísticas y navegación por roles
- **Gestión de Clientes** - CRUD completo para clientes (RF01)
- **Gestión de Autos** - CRUD completo para vehículos (RF02)
- **Gestión de Rentas** - Registro y actualización de rentas (RF05)
- **Gestión de Reparaciones** - Registro de reparaciones (RF03)
- **Sistema de Roles** - Empleado, Encargado de Autos, Dueño

### Funcionalidades por Rol

#### Empleado Atención al Público
- ✅ Mantener datos de cliente (RF01)
- ✅ Buscar vehículos disponibles (RF07)
- ✅ Registrar y actualizar rentas (RF05)

#### Encargado de Autos
- ✅ Mantener datos del auto (RF02)
- ✅ Registrar reparaciones (RF03)
- ✅ Registrar devoluciones (RF09)
- ✅ Consultar autos más rentados (RF06)
- ✅ Alertas de vehículos (RF08)

#### Dueño
- ✅ Consultar reparaciones por periodo (RF04)
- ✅ Reportes financieros
- ✅ Análisis de rentabilidad

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes de UI
- **Lucide React** - Iconos
- **MongoDB Atlas** - Base de datos en la nube

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <tu-repo>
cd bdnosql-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (Automático)
```bash
npm run setup
```
Este comando creará automáticamente el archivo `.env.local` con instrucciones para MongoDB Atlas.

### 4. Configurar MongoDB Atlas
1. Ve a [MongoDB Atlas](https://cloud.mongodb.com) y crea una cuenta gratuita
2. Crea un nuevo cluster (gratuito)
3. En "Database Access", crea un usuario y contraseña
4. En "Network Access", agrega tu IP (o `0.0.0.0/0` para permitir todas)
5. En "Database", crea una base de datos llamada `ConAutos_DB`
6. Copia la URI de conexión y reemplaza "usuario" y "contraseña" en `.env.local`

### 5. Probar la conexión (Opcional)
```bash
npm run test-db
```

### 6. Ejecutar la aplicación
```bash
npm run dev
```

## 📁 Estructura del Proyecto Completa

```
app/
├── page.tsx                    # Login
├── dashboard/page.tsx          # Dashboard principal
├── clients/page.tsx           # Gestión de clientes (RF01)
├── cars/
│   ├── page.tsx              # Gestión de autos (RF02)
│   └── search/page.tsx       # Búsqueda de vehículos (RF07)
├── rentals/page.tsx          # Gestión de rentas (RF05)
├── repairs/page.tsx          # Gestión de reparaciones (RF03)
├── returns/page.tsx          # Devoluciones (RF09)
├── alerts/page.tsx           # Sistema de alertas (RF08)
└── reports/
    ├── repairs/page.tsx      # Reportes de reparaciones (RF04)
    ├── rentals/page.tsx      # Reportes de rentas (RF06)
    └── financial/page.tsx    # Análisis financiero
```

## 🔧 Configuración Manual (Si el setup automático no funciona)

### 1. Variables de Entorno
Crea un archivo `.env.local` con:

```env
# MongoDB Atlas (Recomendado)
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/

# MongoDB local (Alternativa)
# MONGODB_URI=mongodb://localhost:27017/ConAutos_DB
```

### 2. Instalación de Dependencias MongoDB
```bash
npm install mongodb bcryptjs
npm install -D @types/bcryptjs
```

### 3. Implementar Funciones MongoDB

El archivo `lib/mongodb-helpers.ts` contiene todas las funciones que necesitas implementar. Cada función tiene comentarios TODO con ejemplos de implementación.

#### Funciones Principales a Implementar:

**Autenticación:**
- `authenticateUser()` - Validar credenciales de usuario

**Clientes (RF01):**
- `getClients()` - Obtener todos los clientes
- `createClient()` - Crear nuevo cliente
- `updateClient()` - Actualizar cliente
- `deleteClient()` - Eliminar cliente

**Autos (RF02):**
- `getCars()` - Obtener todos los autos
- `createCar()` - Crear nuevo auto
- `updateCar()` - Actualizar auto
- `getAvailableCars()` - Autos disponibles (RF07)

**Rentas (RF05):**
- `getRentals()` - Obtener rentas
- `createRental()` - Crear nueva renta
- `updateRental()` - Actualizar renta

**Reparaciones (RF03, RF04):**
- `getRepairs()` - Obtener reparaciones
- `createRepair()` - Crear reparación
- `getRepairsByDateRange()` - Reparaciones por periodo (RF04)

**Reportes:**
- `getMostRentedCars()` - Autos más rentados (RF06)
- `getDashboardStats()` - Estadísticas del dashboard

### Nuevas Funciones MongoDB a Implementar:

**Búsqueda Avanzada (RF07):**
- `searchAvailableCarsWithFilters()` - Búsqueda con filtros múltiples

**Devoluciones (RF09):**
- `getReturns()` - Obtener devoluciones
- `getActiveRentals()` - Rentas activas para devolver

**Alertas (RF08):**
- `resolveAlert()` - Resolver alertas

**Reportes Financieros:**
- `getFinancialReport()` - Datos financieros por periodo

### 4. Estructura de Base de Datos

El archivo `scripts/create-database.js` contiene la estructura completa de colecciones sugerida:

- **users** - Usuarios del sistema
- **clients** - Clientes
- **cars** - Autos
- **rentals** - Rentas
- **repairs** - Reparaciones
- **returns** - Devoluciones
- **alerts** - Alertas

## 🚀 Cómo Empezar

### 1. Instalar Dependencias
\`\`\`bash
npm install
\`\`\`

### 2. Configurar MongoDB
- Instala MongoDB localmente o usa MongoDB Atlas
- Configura las variables de entorno
- Ejecuta el script de creación de base de datos

### 3. Implementar Funciones MongoDB
- Completa las funciones en `lib/mongodb-helpers.ts`
- Reemplaza los datos simulados con llamadas reales a MongoDB

### 4. Ejecutar la Aplicación
\`\`\`bash
npm run dev
\`\`\`

## 📋 Lista de TODOs para MongoDB

### Prioridad Alta
- [ ] Implementar `connectToDatabase()` en `mongodb-helpers.ts`
- [ ] Implementar `authenticateUser()` para login
- [ ] Implementar funciones CRUD de clientes
- [ ] Implementar funciones CRUD de autos
- [ ] Implementar funciones CRUD de rentas

### Prioridad Media
- [ ] Implementar funciones de reparaciones
- [ ] Implementar sistema de devoluciones
- [ ] Implementar reportes y consultas
- [ ] Implementar sistema de alertas

### Prioridad Baja
- [ ] Implementar backups automáticos
- [ ] Implementar logs del sistema
- [ ] Configurar permisos de base de datos

## 🔐 Usuarios de Prueba

Una vez implementada la autenticación, puedes crear estos usuarios:

\`\`\`javascript
// Empleado
{
  username: "empleado1",
  password: "123456",
  role: "empleado",
  nombre: "Juan Empleado"
}

// Encargado
{
  username: "encargado1", 
  password: "123456",
  role: "encargado",
  nombre: "María Encargada"
}

// Dueño
{
  username: "dueno1",
  password: "123456", 
  role: "dueno",
  nombre: "Carlos Dueño"
}
\`\`\`

## 📞 Soporte

El frontend está completamente funcional con datos simulados. Solo necesitas:

1. Configurar MongoDB
2. Implementar las funciones en `mongodb-helpers.ts`
3. Reemplazar `console.log()` con llamadas reales a las funciones

¡Todo está preparado para una implementación rápida y sencilla de MongoDB! 🎉
