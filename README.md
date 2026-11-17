# Montaña Dept — sitio web

Sitio estático (HTML, CSS y JS puro). No necesita instalar nada ni compilar.
Para verlo en tu computador, abre `index.html` en el navegador.

## Estructura

- `index.html`, `proyectos.html`, `servicios.html`, `nosotros.html`, `contacto.html`, `404.html`
- `proyectos/<slug>.html`: una ficha por proyecto (HTML mínimo, el contenido sale de los datos)
- `assets/js/proyectos.js`: **todos los datos de los proyectos** (única fuente)
- `assets/js/main.js`: menú, índice y grilla de proyectos, filtro, fichas, reloj y formulario
- `assets/css/styles.css`: estilos
- `assets/img/proyectos/<slug>/`: imágenes de cada proyecto
- `assets/logos/`: logos e isotipo

## Cómo agregar un proyecto

1. Crea la carpeta `assets/img/proyectos/<slug>/` y sube ahí las imágenes
   (por ejemplo `portada.jpg`, `diseno-1.jpg`, `foto-1.jpg`). El `<slug>` es un nombre corto,
   en minúsculas y sin espacios (ej. `mi-cliente`).
2. Abre `assets/js/proyectos.js`, copia un bloque `{ ... }` completo y pégalo al final de la lista
   (con una coma entre bloques). Cambia `slug`, `nombre`, `cliente`, `rubro`, `anio`, `categorias`,
   `servicios`, `descripcion`, `instagram` y las rutas de imágenes:
   `portada: "assets/img/proyectos/mi-cliente/portada.jpg"`.
   Una ruta vacía (`""`) muestra un bloque gris "pendiente".
   En `videos` puedes poner un `.mp4` subido a la carpeta o un link de YouTube / Vimeo.
3. Copia `proyectos/fuku.html`, renómbralo a `proyectos/<slug>.html` y cambia solo
   `data-proyecto="fuku"` por `data-proyecto="<slug>"` en la etiqueta `<body>`.
4. Listo: el proyecto aparece en el inicio (índice) y en Proyectos (lista y grilla), con su numeración y los enlaces "Anterior" / "Siguiente". El número fantasma "03" se calcula solo con la cantidad de proyectos.
   En la ficha, `diseno` y `fotos` se acomodan en filas asimétricas que se repiten (1:1 + 4:3, dos 4:5, 16:9); los `videos` van a ancho completo. Cada imagen vacía muestra "[ IMAGEN PENDIENTE ]".

### Fotos agrupadas por series (opcional)

Para las fotos de sesiones puedes usar la lista simple `fotos: ["ruta.jpg", ...]` o, en su lugar,
el campo `series` (si existe, reemplaza a `fotos`):

```js
series: [
  { titulo: "Sándwich", layout: "editorial",
    fotos: [ { src: "assets/img/proyectos/mi-cliente/sesiones/sandwich-01.jpg", w: 1333, h: 2000 } ] },
  { titulo: "Menú", layout: "grilla",
    fotos: [ { src: "assets/img/proyectos/mi-cliente/sesiones/menu-01.jpg", w: 2000, h: 1333 } ] }
],
videos: []
```

Cada serie admite campos opcionales para presentar la sesión (si faltan `titular` y `descripcion`, se muestra como antes):

```js
{ slug: "sandwich",                       // ancla #sesion-sandwich (la usa el índice de tarjetas)
  titulo: "Sándwich",
  bajada: "Fotografía lifestyle.\nDe la plancha a la mano.",  // 2 líneas; la 1ª sale en la tarjeta del índice
  titular: "Frase grande de la sesión.",
  descripcion: "Párrafo que cuenta qué fue y en qué consistió.",
  datos: [ { k: "Tipo", v: "Lifestyle" }, { k: "Piezas", v: "05 fotos" } ],   // mini tabla
  hero: { src: "assets/img/.../foto.jpg", w: 2000, h: 1333, pos: "50% 60%" }, // panorámica 21:9 (opcional); pos = object-position
  etiquetas: ["SANTIAGO, CHILE", "(Ver galería ↓)"],                          // micro-etiquetas sobre el hero (opcional)
  card: { src: "assets/img/.../foto.jpg", w: 1333, h: 2000 },                 // imagen de la tarjeta; si falta, la 1ª foto
  layout: "editorial", fotos: [ ... ] }
```

La sección "Sesiones" muestra un título, un párrafo gris, un índice de tarjetas (una por serie, con link "Ver sesión ↓")
y luego el bloque de cada serie seguido de su galería.

- `w` y `h` son las medidas reales de la foto en píxeles (se usan para mantener la proporción sin recortar).
- `layout: "editorial"`: retícula asimétrica sin recorte, pensada para fotos verticales (de a dos; si sobra una, va centrada).
- `layout: "grilla"`: hoja de contacto de 3 columnas en escritorio, 2 en tablet y 1 en móvil, proporción 3:2.
- `portada` puede ir con `portadaSize: [ancho, alto]` para reservar el espacio.
- Con `videos: []` no aparece ningún bloque de video. Las imágenes reales de `diseno` y `series` se abren en un visor
  (flechas, Esc, deslizar en celular) que navega dentro de la misma serie.

### Diseño agrupado por series (opcional)

`diseno` puede ser la lista simple de rutas (una sola sección "Diseño") o, como en Fuku, una lista de series
con su `grupo`. La ficha crea una sección por grupo (en el orden en que aparecen), con el conteo de piezas
(imágenes + videos) en el encabezado, y dentro cada serie con su subtítulo `[ 01 ] Título — N páginas / piezas / láminas`.

```js
diseno: [
  { grupo: "Branding", titulo: "Manual de marca", layout: "manual",
    fotos: [ { src: "assets/img/proyectos/mi-cliente/diseno/manual-01.jpg", w: 2000, h: 1158, caption: "Portada" } ] },
  { grupo: "Branding", titulo: "Menú imprimible", layout: "editorial",
    fotos: [ { src: "assets/img/proyectos/mi-cliente/diseno/menu-01.jpg", w: 1546, h: 2000 } ] },
  { grupo: "Redes sociales", titulo: "Carrusel · Bebidas", layout: "carrusel",
    fotos: [
      { src: "assets/img/proyectos/mi-cliente/diseno/carrusel-01.jpg", w: 1500, h: 2000 },
      { src: "assets/img/proyectos/mi-cliente/diseno/carrusel-02.mp4", poster: "assets/img/proyectos/mi-cliente/diseno/carrusel-02-poster.jpg", w: 810, h: 1080, video: true }
    ] }
]
```

- `layout: "manual"`: páginas horizontales; la primera a ancho completo y el resto en pares 6+6. `caption` sale bajo la página (`(01) PORTADA`).
- `layout: "editorial"`: igual que en las series de sesiones (retícula asimétrica sin recorte).
- `layout: "carrusel"`: fila horizontal con scroll-snap (como un carrusel de Instagram visto de lado), flechas ← →, contador (`01–04 / 08`) y arrastre con mouse.
  Cada slide mantiene su proporción real (`w` y `h`). Las imágenes se abren en el visor; los videos (`video: true`, con `poster`) van sin audio,
  se reproducen solos cuando se ven al menos al 60 % y se pausan al salir. Con "reducir movimiento" activado en el sistema no se reproducen
  solos: muestran el póster y un botón "Reproducir". Los videos no abren el visor.
- `servicios` del proyecto aparece en "Tipo" de la ficha, junto a las categorías.
- Los proyectos que siguen con `diseno: ["", "", ...]` (lista simple) se ven como siempre.

Categorías disponibles para el filtro: `Branding`, `Redes sociales`, `Publicidad`, `Audiovisual`.

## Publicar gratis en GitHub Pages con montanadept.com

1. Crea un repositorio en GitHub y sube el contenido de esta carpeta a la raíz del repo
   (el archivo `CNAME` ya trae `montanadept.com`).
2. En el repo: **Settings → Pages → Build and deployment**, elige **Deploy from a branch**,
   rama `main`, carpeta `/ (root)`.
3. En **Settings → Pages → Custom domain** escribe `montanadept.com` y guarda.
4. En Squarespace (Dominios → montanadept.com → Configuración DNS) agrega estos registros:

   | Tipo  | Host  | Valor                  |
   |-------|-------|------------------------|
   | A     | @     | 185.199.108.153        |
   | A     | @     | 185.199.109.153        |
   | A     | @     | 185.199.110.153        |
   | A     | @     | 185.199.111.153        |
   | CNAME | www   | `<usuario>.github.io`  |

   Reemplaza `<usuario>` por tu usuario (o la organización) de GitHub.
5. Espera a que el DNS se propague (de minutos a unas horas) y activa
   **Enforce HTTPS** en Settings → Pages.

## Formulario de contacto

Hoy solo muestra el mensaje de agradecimiento (no envía correos). Para conectarlo a
Formspree o Netlify Forms, ver el comentario en `contacto.html` y en `assets/js/main.js`.
