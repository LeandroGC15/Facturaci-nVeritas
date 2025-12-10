# 🚀 Guía Rápida de Despliegue en VPS

> **📖 Para una guía completa sobre cómo mantener el servicio activo, ver [VPS-SETUP.md](./VPS-SETUP.md)**

## Pasos Rápidos

### 1. Configurar .env para Producción

Edita tu archivo `.env` y cambia la URL del API:

```bash
VITE_API_BASE_URL=http://209.126.11.198:8080/api
VITE_APP_NAME=Veritas Facturación
```

### 2. Construir el Proyecto

```bash
npm run build
```

Esto creará la carpeta `dist/` con todos los archivos optimizados.

### 3. Subir al VPS

#### Opción A: Usando SCP

```bash
# Crear directorio en el VPS (si no existe)
ssh usuario@209.126.11.198 "mkdir -p /var/www/veritasfront"

# Subir archivos
scp -r dist/* usuario@209.126.11.198:/var/www/veritasfront/
```

#### Opción B: Usando Git (si tienes el repo en el VPS)

```bash
# En el VPS
cd /var/www/veritasfront
git pull
npm run build
# Los archivos estarán en dist/
```

### 4. Configurar Nginx (Servicio Permanente)

```bash
# En el VPS - Instalar Nginx
sudo apt update
sudo apt install nginx -y

# Crear configuración
sudo nano /etc/nginx/sites-available/veritasfront
# (Copia el contenido de nginx.conf.example)

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/veritasfront /etc/nginx/sites-enabled/
sudo nginx -t  # Verificar configuración
sudo systemctl restart nginx

# Habilitar auto-inicio (ya viene por defecto, pero verificar)
sudo systemctl enable nginx
sudo systemctl status nginx
```

**✅ Nginx se mantendrá activo automáticamente y se iniciará al arrancar el servidor.**

### 5. Verificar

Abre tu navegador y visita: `http://209.126.11.198`

**Ver estado del servicio:**
```bash
sudo systemctl status nginx
```

## Actualizaciones Futuras

Para actualizar la aplicación:

1. Cambia el `.env` si es necesario
2. Ejecuta `npm run build` localmente
3. Sube la nueva carpeta `dist/` al VPS: `scp -r dist/* usuario@209.126.11.198:/var/www/veritasfront/`
4. Recarga Nginx (sin interrumpir el servicio): `sudo systemctl reload nginx`

**Nota:** Nginx seguirá corriendo automáticamente. No necesitas reiniciarlo manualmente a menos que cambies la configuración.

## Troubleshooting

### Error 404 en rutas
- Asegúrate de que Nginx tenga la configuración `try_files $uri $uri/ /index.html;`

### CORS errors
- Verifica que el backend permita peticiones desde tu IP/dominio
- Revisa los headers CORS en el backend

### Variables de entorno no funcionan
- Recuerda: las variables VITE_* se inyectan en tiempo de BUILD, no en runtime
- Si cambias el `.env`, debes reconstruir: `npm run build`

### Ver logs de Nginx
```bash
sudo tail -f /var/log/nginx/veritasfront-error.log
```

