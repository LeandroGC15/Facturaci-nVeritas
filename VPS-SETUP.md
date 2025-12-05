# 🖥️ Configuración Completa del VPS - Servicio Permanente

Esta guía te ayudará a configurar el frontend para que se mantenga siempre activo en tu VPS.

## 📋 Opción 1: Nginx (Recomendado) - Servicio del Sistema

Nginx es un servidor web robusto que se ejecuta como servicio del sistema y se inicia automáticamente.

### Paso 1: Instalar Nginx en el VPS

```bash
# Conectarte al VPS
ssh usuario@209.126.11.198

# Actualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar Nginx
sudo apt install nginx -y

# Verificar que Nginx está corriendo
sudo systemctl status nginx
```

### Paso 2: Crear Directorio para la Aplicación

```bash
# Crear directorio
sudo mkdir -p /var/www/veritasfront

# Dar permisos (reemplaza 'tu-usuario' con tu usuario)
sudo chown -R $USER:$USER /var/www/veritasfront
sudo chmod -R 755 /var/www/veritasfront
```

### Paso 3: Subir Archivos del Build

**Desde tu máquina local:**

```bash
# Asegúrate de haber hecho el build primero
cd /home/vit/Escritorio/Universidad/Sistemas\ 3/veritasfront
npm run build

# Subir archivos al VPS
scp -r dist/* usuario@209.126.11.198:/var/www/veritasfront/
```

### Paso 4: Configurar Nginx

**En el VPS:**

```bash
# Crear archivo de configuración
sudo nano /etc/nginx/sites-available/veritasfront
```

**Pega esta configuración (ajusta la IP si es necesario):**

```nginx
server {
    listen 80;
    server_name 209.126.11.198;  # Tu IP o dominio
    
    root /var/www/veritasfront;
    index index.html;
    
    # Logs
    access_log /var/log/nginx/veritasfront-access.log;
    error_log /var/log/nginx/veritasfront-error.log;
    
    # Configuración para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Compresión gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    
    # Seguridad básica
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Guardar y salir (Ctrl+X, luego Y, luego Enter)**

### Paso 5: Habilitar el Sitio

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/veritasfront /etc/nginx/sites-enabled/

# Eliminar configuración por defecto (opcional)
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Si todo está bien, reiniciar Nginx
sudo systemctl restart nginx
```

### Paso 6: Configurar Auto-inicio (Ya viene por defecto)

Nginx se inicia automáticamente al arrancar el sistema, pero puedes verificar:

```bash
# Verificar que está habilitado
sudo systemctl is-enabled nginx

# Si no está habilitado, habilitarlo
sudo systemctl enable nginx

# Verificar estado
sudo systemctl status nginx
```

### Comandos Útiles de Nginx

```bash
# Reiniciar Nginx
sudo systemctl restart nginx

# Recargar configuración sin interrumpir servicio
sudo systemctl reload nginx

# Ver logs en tiempo real
sudo tail -f /var/log/nginx/veritasfront-error.log

# Verificar que está corriendo
sudo systemctl status nginx
```

---

## 📋 Opción 2: PM2 con Serve (Alternativa con Node.js)

Si prefieres usar Node.js en lugar de Nginx:

### Paso 1: Instalar Node.js y PM2

```bash
# Instalar Node.js (versión 18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2 serve

# Verificar instalación
node --version
pm2 --version
```

### Paso 2: Subir Archivos y Configurar

```bash
# Crear directorio
mkdir -p ~/veritasfront
cd ~/veritasfront

# Subir archivos desde tu máquina local
# scp -r dist/* usuario@209.126.11.198:~/veritasfront/
```

### Paso 3: Iniciar con PM2

```bash
# Iniciar servidor en puerto 3000
pm2 serve ~/veritasfront 3000 --spa --name veritasfront

# Guardar configuración para que persista después de reiniciar
pm2 save

# Configurar PM2 para iniciar al arrancar el sistema
pm2 startup
# Ejecuta el comando que te muestre (algo como: sudo env PATH=...)
```

### Comandos Útiles de PM2

```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs veritasfront

# Reiniciar
pm2 restart veritasfront

# Detener
pm2 stop veritasfront

# Eliminar
pm2 delete veritasfront
```

### Paso 4: Configurar Nginx como Proxy (Opcional)

Si usas PM2, puedes configurar Nginx como proxy reverso:

```nginx
server {
    listen 80;
    server_name 209.126.11.198;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔄 Script de Actualización Automática

Crea un script para facilitar las actualizaciones:

**En el VPS, crear archivo `~/update-frontend.sh`:**

```bash
#!/bin/bash

echo "🔄 Actualizando Veritas Frontend..."

# Ir al directorio del proyecto (ajusta la ruta)
cd ~/veritasfront-source || exit

# Pull de cambios
git pull origin main

# Instalar dependencias si hay cambios
npm install

# Build
npm run build

# Copiar archivos al directorio de Nginx
sudo cp -r dist/* /var/www/veritasfront/

# Reiniciar Nginx
sudo systemctl reload nginx

echo "✅ Actualización completada!"
```

**Dar permisos de ejecución:**

```bash
chmod +x ~/update-frontend.sh
```

**Usar el script:**

```bash
~/update-frontend.sh
```

---

## 🔒 Configurar Firewall (Opcional pero Recomendado)

```bash
# Instalar UFW si no está instalado
sudo apt install ufw -y

# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP
sudo ufw allow 80/tcp

# Permitir HTTPS (si lo configuras después)
sudo ufw allow 443/tcp

# Habilitar firewall
sudo ufw enable

# Verificar estado
sudo ufw status
```

---

## ✅ Verificación Final

1. **Verificar que el servicio está corriendo:**
   ```bash
   # Para Nginx
   sudo systemctl status nginx
   
   # Para PM2
   pm2 status
   ```

2. **Probar desde el navegador:**
   - Abre: `http://209.126.11.198`
   - Deberías ver tu aplicación

3. **Verificar logs si hay problemas:**
   ```bash
   # Nginx
   sudo tail -f /var/log/nginx/veritasfront-error.log
   
   # PM2
   pm2 logs veritasfront
   ```

---

## 🚨 Troubleshooting

### Nginx no inicia
```bash
# Verificar configuración
sudo nginx -t

# Ver logs de error
sudo journalctl -u nginx -n 50
```

### Permisos denegados
```bash
# Ajustar permisos
sudo chown -R www-data:www-data /var/www/veritasfront
sudo chmod -R 755 /var/www/veritasfront
```

### Puerto 80 en uso
```bash
# Ver qué está usando el puerto 80
sudo lsof -i :80

# O
sudo netstat -tulpn | grep :80
```

### El servicio se detiene después de desconectarte
- **Nginx**: Se ejecuta como servicio del sistema, no debería detenerse
- **PM2**: Asegúrate de haber ejecutado `pm2 save` y `pm2 startup`

---

## 📝 Resumen de Comandos Esenciales

```bash
# Nginx
sudo systemctl start nginx      # Iniciar
sudo systemctl stop nginx       # Detener
sudo systemctl restart nginx    # Reiniciar
sudo systemctl status nginx     # Ver estado
sudo systemctl enable nginx     # Habilitar auto-inicio

# PM2
pm2 start app.js                # Iniciar
pm2 stop veritasfront           # Detener
pm2 restart veritasfront        # Reiniciar
pm2 status                      # Ver estado
pm2 save                        # Guardar configuración
```

---

**Recomendación:** Usa **Nginx** para producción. Es más robusto, eficiente y está diseñado específicamente para servir archivos estáticos.

