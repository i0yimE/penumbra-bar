# Penumbra — tu web

Esta carpeta es tu web entera. No necesitas instalar nada, ni contratar hosting técnico raro: solo subirla a Hostinger y ya está online.

## 1. Ver la web en tu ordenador (antes de subirla)

Busca el archivo `index.html` dentro de esta carpeta y haz doble clic. Se abrirá en tu navegador (Chrome, Edge, Firefox...) y verás la web funcionando tal cual la verán tus clientes.

No pasa nada si algún detalle de animación se ve distinto que online — al abrirla así (sin servidor) es completamente normal que el mapa de Google no cargue, por ejemplo. Todo lo demás debe verse bien.

## 2. Subir la web a Hostinger

1. Entra en tu panel de Hostinger → **Administrador de archivos** (File Manager).
2. Ve a la carpeta `public_html` de tu dominio (o la carpeta raíz de tu hosting).
3. Si ya había algo ahí de antes, haz una copia de seguridad o bórralo primero.
4. Arrastra **todo el contenido** de esta carpeta (no la carpeta "penumbra" en sí, sino lo que hay dentro: `index.html`, `styles.css`, `main.js`, la carpeta `lib`, la carpeta `assets`, el archivo `.htaccess`...) dentro de `public_html`.
5. Espera a que termine de subir y entra a tu dominio. Ya está.

**Importante:** el archivo `.htaccess` es invisible en muchos exploradores de archivos porque empieza por un punto. Asegúrate de que Hostinger lo haya subido también (actívalo con "mostrar archivos ocultos" si no lo ves en el Administrador de Archivos). Sin él, cuando hagas cambios en el futuro, tu navegador y el de tus clientes podría tardar en verlos.

## 3. Editar los textos, cócteles y sesiones (sin tocar código)

Todo lo que cambia con frecuencia está en un único archivo:

```
lib/manifest.js
```

Ábrelo con el **Bloc de notas** (clic derecho → Abrir con → Bloc de notas). Vas a ver bloques de texto entre comillas, muy parecido a rellenar una ficha. Por ejemplo:

```js
name: "Penumbra",
slogan: "Donde la noche baja la voz.",
phone: "910 22 33 44",
```

### Reglas de oro para no romper nada

- Cambia solo lo que está **entre comillas** (`"así"`). No borres las comillas ni las comas.
- Si un texto tiene una comilla doble dentro (`"`), escríbela como `\"` o usa comillas simples fuera.
- Después de editar, guarda el archivo (Ctrl+S) sin cambiar el nombre ni la extensión (`.js`).
- Si algo se rompe, no te preocupes: puedes cerrar sin guardar y volver a intentarlo.

### Qué puedes cambiar ahí dentro

- **`brand`**: nombre, eslogan, teléfono, WhatsApp, Instagram, dirección, horario, aforo.
- **`cocktails`**: la lista de las 10 copas. Cada una tiene `name` (nombre), `subtitle` (subtítulo), `ingredients` (lista de ingredientes) y `description` (el texto descriptivo). Puedes cambiar estos textos con total libertad. Los campos `glass`, `liquid` y `accent` controlan el dibujo y los colores de la copa — mejor no tocarlos si no sabes de código.
- **`sessions`**: las 4 sesiones semanales (día, género musical y frase).
- **`gallery`**: la lista de fotos de la galería (ver punto 4).

## 4. Cambiar las fotos

Las fotos viven en la carpeta:

```
assets/img/
```

Ahora mismo hay fotos de stock (con licencia libre, créditos en `assets/credits.json`) para que la web no se vea vacía. En cuanto tengas fotos reales del local, sustitúyelas:

1. Copia tus fotos nuevas dentro de `assets/img/`.
2. Ponles el **mismo nombre** que la foto que vas a sustituir (por ejemplo, si quieres cambiar la foto de portada, tu archivo nuevo debe llamarse `hero.jpg`, sustituyendo al que ya existe).
3. Si tu foto es `.png` o `.jpeg`, renómbrala para que termine en `.jpg`, o dime y te ayudo a ajustar el nombre en el archivo `index.html`.

Fotos importantes que puedes sustituir:
- `hero.jpg` → foto de fondo de la portada.
- `local-1.jpg`, `local-2.jpg`, `local-3.jpg` → el collage de "El Local".
- `events.jpg` → foto de fondo de "Eventos privados".
- `gallery-01.jpg` a `gallery-16.jpg` → las fotos que se mueven en la galería.

Cuando ya no uses las fotos de stock, puedes borrar el aviso de créditos del pie de página si quieres (busca `Créditos de imágenes` en `index.html`), aunque no es obligatorio.

## 5. Cambiar el número de teléfono / WhatsApp

El número aparece en dos sitios y hay que cambiarlo en los dos:

1. **`lib/manifest.js`** → busca `phone`, `phoneHref` y `whatsapp` y cambia los números.
2. **`index.html`** → busca (Ctrl+F en el Bloc de notas) el texto `34910223344` y sustitúyelo por tu nuevo número en todos los sitios donde aparezca (aparece en varios enlaces de WhatsApp).

Formato del número de WhatsApp: código de país + número, sin espacios ni símbolo `+` (ej. `34910223344` para España).

## 6. "He subido cambios y no se ven"

Esto es casi siempre un tema de caché (tu navegador o el de tus clientes "recuerda" la versión antigua). Solución:

1. Prueba primero con **Ctrl + F5** (recarga forzada) en tu navegador.
2. Si sigue sin verse, abre `index.html` con el Bloc de notas y busca (Ctrl+F) el texto `?v=20260707`. Cámbialo por la fecha de hoy, por ejemplo `?v=20260715`, **en todas las apariciones** de ese archivo (aparecen varias veces, una por cada `.css` y `.js`). Guarda y vuelve a subir `index.html` a Hostinger.
3. Eso obliga a todos los navegadores a descargar la versión nueva.

## 7. Qué NO tocar si no estás seguro

- Los archivos `lib/gsap.min.js` y `lib/ScrollTrigger.min.js` — son librerías necesarias para las animaciones, no las edites ni las borres.
- El archivo `.htaccess` — controla la caché del sitio. Solo tócalo si alguien técnico te lo indica.
- La carpeta `tools/` no forma parte de la web (son notas internas del proceso de creación); puedes borrarla si quieres aligerar la carpeta, no afecta a nada.

## 8. Estructura de la carpeta, por si la necesitas

```
penumbra/
├── index.html          ← la página
├── styles.css           ← estilos visuales
├── main.js               ← animaciones y comportamiento
├── .htaccess             ← configuración de caché para Hostinger
├── README.md             ← este archivo
├── lib/
│   ├── manifest.js       ← AQUÍ EDITAS TEXTOS Y DATOS
│   ├── gsap.min.js
│   └── ScrollTrigger.min.js
└── assets/
    ├── img/              ← AQUÍ CAMBIAS LAS FOTOS
    └── credits.json      ← créditos de las fotos de stock
```

Cualquier duda, vuelve a hablar con quien te hizo la web — este README es la chuleta para lo del día a día, no para reescribir la web entera.
