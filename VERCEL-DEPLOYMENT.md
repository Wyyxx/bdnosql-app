# 🚀 Guía de Despliegue en Vercel

## ✅ Verificación Previa

Tu proyecto está listo para Vercel. Se ha verificado que:
- ✅ Conexión a MongoDB Atlas funciona
- ✅ Base de datos ConAutos_DB existe
- ✅ 7 colecciones están disponibles
- ✅ Código está configurado correctamente

## 📋 Pasos para Desplegar

### 1. Subir a GitHub
```bash
git add .
git commit -m "Preparar para Vercel"
git push origin main
```

### 2. Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa tu repositorio `bdnosql-app`

### 3. Configurar Variables de Entorno
En el dashboard de Vercel:
1. Ve a tu proyecto
2. Settings > Environment Variables
3. Agrega la variable:

**Name:** `MONGODB_URI`
**Value:** `mongodb+srv://Admon:aGfVRAQ9dwEwNpSi@escuela.rr7gjjr.mongodb.net/ConAutos_DB?retryWrites=true&w=majority`
**Environment:** Production, Preview, Development

### 4. Verificar MongoDB Atlas
Asegúrate de que en MongoDB Atlas:
- ✅ Cluster esté activo
- ✅ IP `0.0.0.0/0` esté en la whitelist (Network Access)
- ✅ Usuario tenga permisos de lectura/escritura

## 🎯 Resultado Esperado

Una vez desplegado, tu aplicación tendrá:
- ✅ Todas las APIs funcionando (`/api/autos`, `/api/clientes`, etc.)
- ✅ Conexión a la misma base de datos que usas en desarrollo
- ✅ Todas las funcionalidades disponibles

## 🔧 Troubleshooting

Si hay problemas:
1. Verifica las variables de entorno en Vercel
2. Revisa los logs de build en Vercel
3. Confirma que MongoDB Atlas esté accesible
4. Ejecuta `npm run vercel-check` localmente

## 📞 Soporte

Si necesitas ayuda:
- Revisa los logs de Vercel
- Verifica la conexión a MongoDB Atlas
- Ejecuta los scripts de prueba localmente 