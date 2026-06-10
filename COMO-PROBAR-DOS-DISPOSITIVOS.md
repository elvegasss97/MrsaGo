# Cómo probar MesaGo en dos dispositivos

Hay 2 pantallas:

1. **Cliente / mesa**
   - `mesago-boraz-final-sincronizado.html`
   - Se abre en el móvil del cliente.
   - Permite ver carta, añadir productos y enviar pedido.

2. **Cocina / barra**
   - `mesago-cocina-barra.html`
   - Se abre en tablet, portátil o móvil del bar.
   - Recibe los pedidos en tiempo real y permite marcarlos como preparando, servido o cancelado.

## Lo único que falta

Para que funcione entre dos dispositivos reales hace falta Firebase Realtime Database.

En ambos archivos hay este bloque:

```js
const firebaseConfig = {
  apiKey: "PEGA_AQUI",
  authDomain: "PEGA_AQUI",
  databaseURL: "PEGA_AQUI",
  projectId: "PEGA_AQUI",
  storageBucket: "PEGA_AQUI",
  messagingSenderId: "PEGA_AQUI",
  appId: "PEGA_AQUI"
};
```

Hay que pegar exactamente la misma configuración en los dos archivos.

## Sala compartida

Los dos archivos usan la misma sala:

```js
const SALA = "boraz-demo";
```

Mientras coincida, los pedidos del móvil aparecen en cocina/barra.

## Flujo de demo comercial

1. Abrir `mesago-cocina-barra.html` en una tablet o portátil.
2. Abrir `mesago-boraz-final-sincronizado.html` en un móvil.
3. Añadir 2-3 productos al carrito desde el móvil.
4. Confirmar pedido.
5. El pedido aparece en cocina/barra.
6. En cocina, pulsar “Preparando”.
7. En el móvil se actualiza el estado.
8. En cocina, pulsar “Servido”.

## Nota importante

El pago de esta demo es simulado. Para vender el piloto inicial, lo recomendable es presentarlo como:

> “Enviar pedido a barra/cocina desde mesa. El pago real puede mantenerse como ahora al principio.”
