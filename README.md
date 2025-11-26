# Veritas Front - Sistema de Facturación Multi-tenant

Proyecto frontend desarrollado con React 19, TypeScript, Tailwind CSS y Vite. Sistema de facturación multi-tenant que consume un backend Spring Boot.

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
- Backend Spring Boot corriendo en `http://localhost:8080`

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

El proyecto espera los siguientes endpoints del backend Spring Boot:

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

