# Demo móvil MesaGo

Archivo base recibido por Telegram:

- `mesago-movil-firebase.html`

## Qué representa
Demo móvil para cliente final en mesa:

- Carta digital por QR.
- Mesa fija de ejemplo: Mesa 13.
- Carrito.
- Pago simulado: tarjeta, Bizum o efectivo.
- Envío de pedido a cocina mediante Firebase Realtime Database.
- Seguimiento de estado: recibido, preparando, servido.

## Pendiente para hacerlo vendible
1. Crear vista de cocina/barra conectada a la misma sala Firebase.
2. Sustituir placeholders de Firebase por configuración real.
3. Hacer versión parametrizable por local, mesa y sala.
4. Preparar demo comercial para enseñar a bares sin depender todavía de pagos reales.


## Versiones guardadas

- `mesago-movil-firebase.html` — versión con Firebase/estado en tiempo real.
- `mesago-boraz-final.html` — versión final visual de BORAZ con carta completa, carrito y pago simulado.

- `cocina-barra-firebase.html` — pantalla de cocina/barra para recibir pedidos en una tablet usando la misma sala Firebase.

## Demo en dos dispositivos

1. Abrir `mesago-movil-firebase.html` en el móvil del cliente.
2. Abrir `cocina-barra-firebase.html` en una tablet/ordenador de cocina o barra.
3. Pegar la misma configuración Firebase en ambos archivos.
4. Mantener el mismo valor de `SALA`, ahora `boraz-demo`, en ambos.
5. Cuando el cliente confirme el pedido, aparece en cocina/barra.
6. Desde cocina se puede marcar como `Preparando` o `Servido`; el móvil actualiza el estado.


## Demo dos dispositivos lista

- `mesago-boraz-final-sincronizado.html` — móvil cliente conectado a Firebase.
- `mesago-cocina-barra.html` — pantalla de cocina/barra conectada a la misma sala.
- `COMO-PROBAR-DOS-DISPOSITIVOS.md` — instrucciones para probarlo.

Para que funcione en dispositivos distintos falta pegar la configuración real de Firebase en ambos HTML.


## Demo local sin Firebase

- `server.js` — servidor local para conectar móvil y cocina/barra.
- `mesago-boraz-local.html` — menú cliente sin Firebase.
- `mesago-cocina-local.html` — pantalla cocina/barra sin Firebase.
- `PROBAR-SIN-FIREBASE.md` — instrucciones simples.

Esta es la opción recomendada para enseñar la demo rápido a bares: no requiere crear cuenta ni configurar Firebase.
