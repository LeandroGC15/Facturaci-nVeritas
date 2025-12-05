# Veritas Front - Sistema de Facturación Multi-tenant

Proyecto frontend desarrollado con React 19, TypeScript, Tailwind CSS y Vite. Sistema de facturación multi-tenant que consume un backend REST API (compatible con cualquier implementación: Spring Boot, Go, Node.js, etc.).

## 🚀 Características

- ✅ Autenticación y autorización
- ✅ Dashboard con métricas y reportes (diarios, semanales, mensuales)
- ✅ Gestión de stock con CRUD completo
- ✅ Carga masiva de productos (CSV/Excel)
- ✅ Arquitectura multi-tenant
- ✅ Estructura modular con hooks personalizados
- ✅ API Client centralizado con interceptores
- ✅ UI moderna con Tailwind CSS

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend REST API corriendo (por defecto en `http://localhost:8080`)

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con la URL de tu backend:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Veritas Facturación
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── api/              # Cliente API y endpoints
│   ├── client.ts     # Cliente HTTP con interceptores
│   └── endpoints.ts  # Definición de endpoints
├── components/       # Componentes React
│   ├── common/      # Componentes reutilizables
│   ├── layout/      # Layout y navegación
│   ├── auth/        # Componentes de autenticación
│   ├── dashboard/    # Componentes del dashboard
│   └── stock/       # Componentes de stock
├── context/          # Contextos de React
│   ├── AuthContext.tsx
│   └── TenantContext.tsx
├── hooks/           # Hooks personalizados
│   ├── auth/
│   ├── tenant/
│   ├── dashboard/
│   └── stock/
├── pages/           # Páginas principales
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── Stock.tsx
├── types/           # Tipos TypeScript
├── utils/           # Utilidades
└── config/          # Configuración
```

## 🔌 Integración con Backend

El proyecto espera los siguientes endpoints del backend REST API (compatible con cualquier lenguaje/framework que implemente estos endpoints):

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Dashboard
- `GET /api/dashboard/metrics` - Obtener métricas
- `GET /api/dashboard/reports?period={daily|weekly|monthly}&startDate=&endDate=` - Obtener reportes

### Stock
- `GET /api/stock` - Listar productos
- `POST /api/stock` - Crear producto
- `PUT /api/stock/:id` - Actualizar producto
- `DELETE /api/stock/:id` - Eliminar producto
- `POST /api/stock/upload` - Carga masiva

### Headers Requeridos
- `Authorization: Bearer <token>`
- `X-Tenant-ID: <tenant-id>`
- `Content-Type: application/json`

## 🎨 Tecnologías Utilizadas

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router** - Routing
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Recharts** - Gráficos
- **date-fns** - Manejo de fechas

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción
- `npm run lint` - Ejecuta el linter

## 🚀 Despliegue en VPS

> **📖 Documentación completa:** Ver [VPS-SETUP.md](./VPS-SETUP.md) para guía detallada sobre cómo mantener el servicio activo permanentemente.

> **⚡ Despliegue rápido:** Usa el script `./deploy.sh usuario@tu-vps` para automatizar el proceso.

### Preparación Local

1. **Configurar variables de entorno para producción:**

   Crea o edita tu archivo `.env` con la URL de tu VPS:

   ```bash
   # Para producción en VPS
   VITE_API_BASE_URL=http://209.126.11.198:8080/api
   # O si tienes dominio:
   # VITE_API_BASE_URL=https://tu-dominio.com/api
   
   VITE_APP_NAME=Veritas Facturación
   ```

2. **Construir el proyecto para producción:**

   ```bash
   npm run build
   ```

   Esto generará una carpeta `dist/` con los archivos optimizados listos para producción.

3. **Verificar el build localmente (opcional):**

   ```bash
   npm run preview
   ```

### Despliegue en el VPS

#### Opción 1: Usando Nginx (Recomendado)

1. **Subir archivos al VPS:**

   ```bash
   # Desde tu máquina local, sube la carpeta dist/
   scp -r dist/* usuario@209.126.11.198:/var/www/veritasfront/
   ```

2. **Configurar Nginx:**

   Crea o edita `/etc/nginx/sites-available/veritasfront`:

   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;  # O tu IP: 209.126.11.198
       
       root /var/www/veritasfront;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Cache para assets estáticos
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **Habilitar el sitio y reiniciar Nginx:**

   ```bash
   sudo ln -s /etc/nginx/sites-available/veritasfront /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### Opción 2: Usando servidor HTTP simple (Node.js)

1. **Instalar serve globalmente en el VPS:**

   ```bash
   npm install -g serve
   ```

2. **Subir archivos y ejecutar:**

   ```bash
   # Subir dist/
   scp -r dist/* usuario@209.126.11.198:/home/usuario/veritasfront/
   
   # En el VPS, ejecutar:
   serve -s /home/usuario/veritasfront -l 3000
   ```

3. **Usar PM2 para mantener el proceso activo:**

   ```bash
   npm install -g pm2
   pm2 serve /home/usuario/veritasfront 3000 --spa
   pm2 save
   pm2 startup
   ```

#### Opción 3: Usando Docker

1. **Crear Dockerfile (si no existe):**

   ```dockerfile
   FROM nginx:alpine
   COPY dist/ /usr/share/nginx/html/
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Construir y ejecutar:**

   ```bash
   docker build -t veritasfront .
   docker run -d -p 80:80 veritasfront
   ```

### Configuración de CORS en el Backend

Asegúrate de que tu backend permita peticiones desde el dominio/IP del frontend:

```go
// Ejemplo para Go (ajusta según tu framework)
corsConfig := cors.New(cors.Options{
    AllowedOrigins: []string{"http://209.126.11.198", "http://tu-dominio.com"},
    AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders: []string{"Authorization", "Content-Type", "X-Tenant-ID"},
})
```

### Verificación Post-Despliegue

1. Accede a tu aplicación: `http://209.126.11.198` (o tu dominio)
2. Verifica que las peticiones al API funcionen correctamente
3. Revisa la consola del navegador para errores de CORS o conexión
4. Verifica que el token de autenticación se guarde correctamente

### Notas Importantes

- ⚠️ **Las variables de entorno se inyectan en tiempo de build**, no en tiempo de ejecución. Si cambias el `.env`, debes reconstruir el proyecto.
- 🔒 Para producción, considera usar HTTPS con Let's Encrypt
- 📦 El build de producción está optimizado: minificado, sin console.logs, y con code splitting
- 🔄 Para actualizar, simplemente reconstruye y vuelve a subir la carpeta `dist/`

## 🔐 Multi-tenancy

El sistema está diseñado para soportar múltiples tenants. El tenant se identifica mediante:
- Header `X-Tenant-ID` en todas las peticiones
- Almacenamiento en contexto y localStorage
- Detección automática desde el token de autenticación

## 🚧 Próximas Mejoras

- [ ] Refresh token automático
- [ ] Notificaciones toast
- [ ] Filtros avanzados en stock
- [ ] Exportación de reportes
- [ ] Modo oscuro
- [ ] Tests unitarios y de integración

## 📄 Licencia

Este proyecto es parte del curso de Sistemas 3.

