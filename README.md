# Montaña Dept — sitio web

Sitio estático (HTML, CSS y JS puro). No necesita instalar nada ni compilar.
Para verlo en tu computador, abre `index.html` en el navegador.

## Estructura

- `index.html`, `proyectos.html`, `servicios.html`, `nosotros.html`, `contacto.html`, `404.html`
- `proyectos/<slug>.html`: una ficha por proyecto (HTML mínimo, el contenido sale de los datos)
- `assets/js/proyectos.js`: **todos los datos de los proyectos** (única fuente)
- `assets/js/main.js`: menú, grillas, filtro, fichas y formulario
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
4. Listo: el proyecto aparece en el inicio y en Proyectos, con su numeración y el enlace "Siguiente proyecto".

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
