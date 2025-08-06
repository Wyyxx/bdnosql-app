# 🚀 Guía Visual: Despliegue en Vercel

## 📋 Paso a Paso

### 1. Ir a Vercel
- Abre [vercel.com](https://vercel.com)
- Inicia sesión con tu cuenta de GitHub

### 2. Crear Nuevo Proyecto
- Click en "New Project"
- Busca tu repositorio: `Wyyxx/bdnosql-app`
- Click en "Import"

### 3. Configurar Variables de Entorno
**IMPORTANTE:** Antes de hacer click en "Deploy", configura las variables:

1. En la página de configuración del proyecto
2. Busca la sección "Environment Variables"
3. Click en "Add"
4. Configura:
   ```
   Name: MONGODB_URI
   Value: mongodb+srv://Admon:aGfVRAQ9dwEwNpSi@escuela.rr7gjjr.mongodb.net/ConAutos_DB?retryWrites=true&w=majority
   Environment: Production, Preview, Development
   ```

### 4. Desplegar
- Click en "Deploy"
- Espera a que termine el build (2-3 minutos)
- ¡Listo! Tu aplicación estará en línea

## 🔗 URLs que tendrás

- **Producción:** `https://tu-proyecto.vercel.app`
- **Preview:** `https://tu-proyecto-git-main.vercel.app`

## ✅ Verificación Post-Despliegue

Una vez desplegado, verifica:

1. **Página principal carga correctamente**
2. **Login funciona**
3. **APIs responden:** `/api/autos`, `/api/clientes`
4. **Base de datos conecta**

## 🆘 Si hay problemas

1. **Revisa los logs de build en Vercel**
2. **Verifica que MONGODB_URI esté configurada**
3. **Confirma que MongoDB Atlas esté accesible**
4. **Ejecuta `npm run vercel-check` localmente**

## 🎯 Resultado Final

Tu aplicación estará disponible en:
- **URL:** `https://tu-proyecto.vercel.app`
- **Base de datos:** MongoDB Atlas (misma que desarrollo)
- **Funcionalidades:** Todas disponibles
- **APIs:** Completamente funcionales 