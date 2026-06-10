# Probar MesaGo en dos dispositivos sin Firebase

Esta es la forma más fácil para una demo local.

## 1. Abrir terminal en esta carpeta

```bash
cd /home/elias/.openclaw/workspace/MesaGo/demo
node server.js
```

Déjalo abierto.

## 2. Abrir cocina/barra

En el ordenador/tablet de cocina abre la URL que salga en terminal, por ejemplo:

```text
http://192.168.1.50:8787/mesago-cocina-local.html
```

## 3. Abrir menú cliente

En el móvil, conectado a la misma WiFi, abre:

```text
http://192.168.1.50:8787/mesago-boraz-local.html
```

## 4. Hacer la demo

1. Desde el móvil añade productos al carrito.
2. Pulsa confirmar.
3. El pedido aparece en cocina/barra.
4. Desde cocina pulsa “Preparando”.
5. El móvil se actualiza.
6. Pulsa “Servido”.

## Importante

- No necesita Firebase.
- No necesita cuentas externas.
- Funciona mientras el ordenador donde corre `server.js` esté encendido y los dispositivos estén en la misma WiFi.
- Es perfecto para enseñar una demo a bares.
- Para producción real más adelante sí convendrá usar servidor online, Firebase, Supabase o similar.
