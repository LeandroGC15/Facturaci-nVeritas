# 🚀 Guía Rápida de Despliegue en VPS

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

### 4. Configurar Nginx

```bash
# En el VPS
sudo cp nginx.conf.example /etc/nginx/sites-available/veritasfront
sudo nano /etc/nginx/sites-available/veritasfront  # Ajustar según necesites
sudo ln -s /etc/nginx/sites-available/veritasfront /etc/nginx/sites-enabled/
sudo nginx -t  # Verificar configuración
sudo systemctl restart nginx
```

### 5. Verificar

Abre tu navegador y visita: `http://209.126.11.198`

## Actualizaciones Futuras

Para actualizar la aplicación:

1. Cambia el `.env` si es necesario
2. Ejecuta `npm run build`
3. Sube la nueva carpeta `dist/` al VPS
4. Reinicia Nginx si es necesario: `sudo systemctl restart nginx`

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

