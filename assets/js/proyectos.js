/*
 * Montaña Dept — datos de proyectos.
 * ÚNICA fuente de datos del sitio: para agregar un proyecto, copia un bloque
 * de abajo, cambia los valores y listo (ver README.md).
 *
 * Reglas:
 * - Las rutas de imagen/video son relativas a la raíz del sitio,
 *   por ejemplo "assets/img/proyectos/fuku/portada.jpg".
 * - Ruta vacía ("") = se muestra un bloque gris "pendiente".
 * - videos[]: archivo .mp4 (ruta relativa) o link de YouTube / Vimeo.
 *   Con [] no se muestra ningún bloque de video.
 * - portadaSize: [ancho, alto] en píxeles de la portada (opcional; evita saltos de layout).
 * - diseno[], dos formas (la ficha usa la que encuentre):
 *   a) lista simple: ["ruta.jpg", "", ...] (o [{ src: "ruta.jpg" }, ...]; "" = pendiente).
 *      Se muestra en una sola sección "Diseño", en filas asimétricas. Las imágenes reales se abren en el visor.
 *   b) series agrupadas: cada elemento es una serie con su `grupo`. La ficha crea una sección por grupo
 *      (en orden de aparición), con el conteo de piezas (imágenes + videos) en el encabezado, y dentro
 *      cada serie con su subtítulo "[ 01 ] Título — N páginas / piezas / láminas".
 *        diseno: [
 *          {
 *            grupo: "Branding",             // nombre de la sección (Branding, Redes sociales, ...)
 *            titulo: "Manual de marca",     // subtítulo de la serie (y título en el visor)
 *            layout: "manual",              // "manual"    = páginas horizontales: la primera a ancho completo, el resto en pares 6+6
 *                                           // "editorial" = retícula asimétrica sin recorte (fotos verticales)
 *                                           // "carrusel"  = fila horizontal con scroll-snap, flechas y contador
 *            fotos: [
 *              { src: "assets/img/proyectos/<slug>/diseno/manual-01.jpg", w: 2000, h: 1158, caption: "Portada" },
 *              // en un carrusel también puede haber videos (sin audio, se reproducen al verse; no abren el visor):
 *              { src: "assets/img/proyectos/<slug>/diseno/video-01.mp4", poster: "assets/img/proyectos/<slug>/diseno/video-01-poster.jpg", w: 810, h: 1080, video: true }
 *            ]
 *          }
 *        ]
 *      w y h son las medidas reales en píxeles (reservan el espacio y fijan la proporción).
 *      caption (opcional) sale bajo la pieza: "(01) PORTADA". Un `grupo` omitido se llama "Diseño".
 *
 * sesionesIntro (opcional, por proyecto): párrafo gris bajo el título "Sesiones". Si falta usa:
 *   "Cada sesión parte de una idea simple y la desarrollamos en fotos."
 * Fotos de sesiones, dos formas (series reemplaza a fotos cuando existe):
 *   a) fotos: ["ruta1.jpg", "", ...]   -> lista simple, en filas asimétricas (como hasta ahora).
 *   b) series: [                        -> fotos agrupadas en series con subtítulo.
 *        {
 *          titulo: "Sándwich",           // nombre de la serie (sale en el subtítulo y en el visor)
 *          layout: "editorial",          // "editorial" = retícula asimétrica sin recorte (ideal fotos verticales)
 *                                        // "grilla"    = hoja de contacto 3 / 2 / 1 columnas, proporción 3:2
 *          fotos: [ { src: "assets/img/proyectos/<slug>/sesiones/foto-01.jpg", w: 1333, h: 2000 }, ... ]
 *        }
 *      ]
 *      w y h son las medidas reales en píxeles: se usan para reservar el espacio y mantener la proporción.
 *      Campos opcionales de presentación por serie (si faltan titular y descripcion, la serie se ve como antes):
 *      Campos opcionales por serie (la ficha las muestra como portada + índice por carpetas):
 *        slug:        "sandwich"   // ancla #sesion-sandwich de la fila del índice; si falta, "serie-<n>"
 *        bajada:      "Línea 1.\nLínea 2."  // texto chico gris de la portada (se une en una línea, máx. 2 líneas visibles); si falta usa descripcion
 *        titular:     "Frase grande"       // se muestra en la vista CRÉDITOS de la serie
 *        descripcion: "Párrafo..."         // se muestra en la vista CRÉDITOS de la serie
 *        datos:       [ { k: "Tipo", v: "Lifestyle" }, ... ]   // el valor de "Tipo" sale en "CLIENTE | TIPO" (si falta: "SESIÓN")
 *        fecha:       "2026"               // texto corto al pie de la columna izquierda (ej. "2026", "SEP 2026", "08-09 · 2026")
 *        creditos:    ["DIRECCIÓN DE ARTE: MONTAÑA DEPT", "FOTOGRAFÍA: [ PENDIENTE ]"]  // una línea por ítem; vista CRÉDITOS
 *        card:        { src: "ruta.jpg", w: 1333, h: 2000 }    // imagen de la portada; si falta usa la primera foto
 *      `layout` ya no cambia la ficha: todas las series se ven como hoja de contacto (contraída) o imágenes grandes (expandida).
 * - anio y servicios vacíos se muestran como "—".
 * - destacado: false lo oculta del inicio (sigue en Proyectos).
 * - categorias válidas: "Branding", "Redes sociales", "Publicidad", "Audiovisual".
 */
window.PROYECTOS = [
  {
    slug: "fuku",
    nombre: "Fuku",
    cliente: "Fuku",
    rubro: "Comida coreana",
    anio: "",
    categorias: ["Branding", "Redes sociales"],
    servicios: ["Identidad visual", "Manual de marca", "Menú", "Contenido para redes sociales", "Fotografía"],
    descripcion: "Descripción del proyecto pendiente.",
    sesionesIntro: "Cada sesión parte de una idea simple: mostrar el producto como se vive en el local. Aquí va el detalle de cada una.",
    instagram: "@fuku_kf",
    destacado: true,
    portada: "assets/img/proyectos/fuku/portada.jpg",
    portadaSize: [1333, 2000],
    diseno: [
      {
        grupo: "Redes sociales",
        titulo: "Carrusel · Bebidas",
        layout: "carrusel",
        fotos: [
          { src: "assets/img/proyectos/fuku/diseno/carrusel-bebidas-01.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-bebidas-02.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-bebidas-03.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-bebidas-04.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-bebidas-05.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-bebidas-06.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-bebidas-07.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-bebidas-08.jpg", w: 1500, h: 2000 }
        ]
      },
      {
        grupo: "Redes sociales",
        titulo: "Carrusel · Ramyeon",
        layout: "carrusel",
        fotos: [
          { src: "assets/img/proyectos/fuku/diseno/carrusel-ramyeon-01.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-ramyeon-02.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-ramyeon-03.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-ramyeon-04.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-ramyeon-05.jpg", w: 1500, h: 2000 }
        ]
      },
      {
        grupo: "Redes sociales",
        titulo: "Carrusel · Kimchicken",
        layout: "carrusel",
        fotos: [
          { src: "assets/img/proyectos/fuku/diseno/carrusel-kimchicken-01.jpg", w: 1080, h: 1440 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-kimchicken-02.jpg", w: 1080, h: 1440 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-kimchicken-03.jpg", w: 1080, h: 1440 }
        ]
      },
      {
        grupo: "Redes sociales",
        titulo: "Carrusel · Belly",
        layout: "carrusel",
        fotos: [
          { src: "assets/img/proyectos/fuku/diseno/carrusel-belly-01.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-belly-02.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-belly-03.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-belly-04.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-belly-05.jpg", w: 1500, h: 2000 }
        ]
      },
      {
        grupo: "Redes sociales",
        titulo: "Carrusel · Reseñas",
        layout: "carrusel",
        fotos: [
          { src: "assets/img/proyectos/fuku/diseno/carrusel-resenas-01.jpg", w: 1080, h: 1440 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-resenas-02.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-resenas-03.gif", w: 480, h: 640 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-resenas-04.gif", w: 480, h: 640 },
          { src: "assets/img/proyectos/fuku/diseno/carrusel-resenas-05.gif", w: 480, h: 640 }
        ]
      }
    ],
    series: [
      {
        slug: "septiembre",
        titulo: "Septiembre",
        fecha: "SEP 2026",
        creditos: ["DIRECCIÓN DE ARTE: MONTAÑA DEPT", "FOTOGRAFÍA: [ PENDIENTE ]", "CLIENTE: FUKU"],
        bajada: "Sesión mensual de contenido · septiembre 2026.",
        card: { src: "assets/img/proyectos/fuku/sesiones/septiembre-01.jpg", w: 1000, h: 1500 },
        layout: "editorial",
        fotos: [
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-01.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-02.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-03.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-04.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-05.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-06.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-07.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-08.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-09.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-10.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-11.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-12.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-13.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-14.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/fuku/sesiones/septiembre-15.jpg", w: 1000, h: 1500 }
        ]
      },
      {
        slug: "octubre",
        titulo: "Octubre",
        fecha: "OCT 2026",
        creditos: ["DIRECCIÓN DE ARTE: MONTAÑA DEPT", "FOTOGRAFÍA: [ PENDIENTE ]", "CLIENTE: FUKU"],
        bajada: "Sesión mensual de contenido · octubre 2026.",
        card: { src: "assets/img/proyectos/fuku/sesiones/octubre-01.jpg", w: 1000, h: 1500 },
        layout: "editorial",
        fotos: [
          { src: "assets/img/proyectos/fuku/sesiones/octubre-01.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/octubre-02.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/octubre-03.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/octubre-04.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/octubre-05.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/octubre-06.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/octubre-07.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/octubre-08.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/octubre-09.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/octubre-10.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/octubre-11.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/fuku/sesiones/octubre-12.jpg", w: 1000, h: 1500 }
        ]
      },
      {
        slug: "menu",
        titulo: "Menú",
        fecha: "2026",
        creditos: ["DIRECCIÓN DE ARTE: MONTAÑA DEPT", "FOTOGRAFÍA: [ PENDIENTE ]", "CLIENTE: FUKU"],
        bajada: "Fotografía de producto.\nToda la carta en un mismo set.",
        titular: "Dieciséis platos, un mismo mesón.",
        descripcion: "Fotografiamos la carta completa sobre el mesón de acero del local, con el mismo ángulo y la misma luz en cada plato. Así la carta se ve ordenada, reconocible y lista para usar en redes y en el menú.",
        datos: [
          { k: "Tipo", v: "Producto" },
          { k: "Piezas", v: "16 fotos" },
          { k: "Uso", v: "Carta y redes sociales" }
        ],
        card: { src: "assets/img/proyectos/fuku/sesiones/menu-01.jpg", w: 2000, h: 1333 },
        layout: "grilla",
        fotos: [
          { src: "assets/img/proyectos/fuku/sesiones/menu-01.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-02.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-03.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-04.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-05.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-06.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-07.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-08.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-09.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-10.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-11.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-12.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-13.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-14.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-15.jpg", w: 2000, h: 1333 },
          { src: "assets/img/proyectos/fuku/sesiones/menu-16.jpg", w: 2000, h: 1333 }
        ]
      }
    ],
    videos: []
  },
  {
    slug: "shawi",
    nombre: "Shawi",
    cliente: "Shawi",
    rubro: "Comida árabe",
    anio: "",
    categorias: ["Branding", "Redes sociales"],
    servicios: [],
    descripcion: "Descripción del proyecto pendiente.",
    sesionesIntro: "Cada sesión cuenta una jornada completa: el servicio, la gente y el producto en su contexto.",
    instagram: "@shawi_cl",
    destacado: true,
    portada: "assets/img/proyectos/shawi/sesiones/popup-01.jpg",
    portadaSize: [1500, 2000],
    diseno: [
      {
        grupo: "Redes sociales",
        titulo: "Carrusel · Pop-up",
        layout: "carrusel",
        fotos: [
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup-01.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup-02.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup-03.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup-04.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup-05.jpg", w: 1125, h: 1500 }
        ]
      },
      {
        grupo: "Redes sociales",
        titulo: "Carrusel · Pop-up II",
        layout: "carrusel",
        fotos: [
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup2-01.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup2-02.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup2-03.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup2-04.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup2-05.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup2-06.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup2-07.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup2-08.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-popup2-09.jpg", w: 1125, h: 1500 }
        ]
      },
      {
        grupo: "Redes sociales",
        titulo: "Carrusel 04",
        layout: "carrusel",
        fotos: [
          { src: "assets/img/proyectos/shawi/diseno/carrusel-04-01.jpg", w: 1080, h: 1440 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-04-02.jpg", w: 1080, h: 1440 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-04-03.jpg", w: 1080, h: 1440 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-04-04.jpg", w: 1080, h: 1440 }
        ]
      },
      {
        grupo: "Redes sociales",
        titulo: "Carrusel Shawi",
        layout: "carrusel",
        fotos: [
          { src: "assets/img/proyectos/shawi/diseno/carrusel-shawi-01.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-shawi-02.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-shawi-03.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-shawi-04.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-shawi-05.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-shawi-06.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/diseno/carrusel-shawi-07.jpg", w: 1125, h: 1500 }
        ]
      }
    ],
    videos: [],
    series: [
      {
        slug: "septiembre",
        titulo: "Septiembre",
        fecha: "SEP 2026",
        creditos: ["DIRECCIÓN DE ARTE: MONTAÑA DEPT", "FOTOGRAFÍA: [ PENDIENTE ]", "CLIENTE: SHAWI"],
        bajada: "Sesión mensual de contenido · septiembre 2026.",
        card: { src: "assets/img/proyectos/shawi/sesiones/septiembre-01.jpg", w: 1125, h: 1500 },
        layout: "editorial",
        fotos: [
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-01.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-02.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-03.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-04.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-05.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-06.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-07.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-08.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-09.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-10.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-11.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-12.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-13.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-14.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-15.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-16.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-17.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-18.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-19.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-20.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-21.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-22.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-23.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-24.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-25.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-26.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-27.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-28.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-29.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-30.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-31.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-32.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-33.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/septiembre-34.jpg", w: 1000, h: 1500 }
        ]
      },
      {
        slug: "octubre",
        titulo: "Octubre",
        fecha: "OCT 2026",
        creditos: ["DIRECCIÓN DE ARTE: MONTAÑA DEPT", "FOTOGRAFÍA: [ PENDIENTE ]", "CLIENTE: SHAWI"],
        bajada: "Sesión mensual de contenido · octubre 2026.",
        card: { src: "assets/img/proyectos/shawi/sesiones/octubre-01.jpg", w: 1125, h: 1500 },
        layout: "editorial",
        fotos: [
          { src: "assets/img/proyectos/shawi/sesiones/octubre-01.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-02.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-03.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-04.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-05.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-06.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-07.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-08.jpg", w: 1500, h: 1125 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-09.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-10.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-11.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-12.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-13.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-14.jpg", w: 1200, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/octubre-15.jpg", w: 1200, h: 1500 }
        ]
      },
      {
        slug: "noviembre",
        titulo: "Noviembre",
        fecha: "NOV 2026",
        creditos: ["DIRECCIÓN DE ARTE: MONTAÑA DEPT", "FOTOGRAFÍA: [ PENDIENTE ]", "CLIENTE: SHAWI"],
        bajada: "Sesión mensual de contenido · noviembre 2026.",
        card: { src: "assets/img/proyectos/shawi/sesiones/noviembre-01.jpg", w: 1125, h: 1500 },
        layout: "editorial",
        fotos: [
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-01.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-02.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-03.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-04.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-05.jpg", w: 1072, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-06.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-07.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-08.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-09.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-10.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-11.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-12.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-13.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-14.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-15.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-16.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-17.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-18.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-19.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-20.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-21.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-22.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-23.jpg", w: 1072, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-24.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-25.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-26.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-27.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-28.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-29.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-30.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-31.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-32.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-33.jpg", w: 1125, h: 1500 },
          { src: "assets/img/proyectos/shawi/sesiones/noviembre-34.jpg", w: 1072, h: 1500 }
        ]
      }
    ]
  },
  {
    slug: "935",
    nombre: "935",
    cliente: "935 Helados",
    rubro: "Heladería en Viña del Mar",
    anio: "",
    categorias: ["Branding", "Redes sociales"],
    servicios: [],
    descripcion: "Descripción del proyecto pendiente.",
    instagram: "@935helados",
    destacado: true,
    portada: "",
    diseno: ["", "", "", ""],
    fotos: ["", "", "", ""],
    videos: [""]
  },
  {
    slug: "dokebi",
    nombre: "Dokebi",
    cliente: "Dokebi",
    rubro: "",
    anio: "",
    categorias: ["Redes sociales"],
    servicios: [],
    descripcion: "Descripción del proyecto pendiente.",
    sesionesIntro: "Registro fotográfico del proyecto.",
    instagram: "",
    destacado: true,
    portada: "assets/img/proyectos/dokebi/portada.jpg",
    portadaSize: [1000, 1500],
    diseno: [],
    videos: [],
    series: [
      {
        slug: "sesion",
        titulo: "Sesión",
        fecha: "2026",
        creditos: ["DIRECCIÓN DE ARTE: MONTAÑA DEPT", "FOTOGRAFÍA: [ PENDIENTE ]", "CLIENTE: DOKEBI"],
        bajada: "Registro fotográfico.",
        card: { src: "assets/img/proyectos/dokebi/sesiones/sesion-01.jpg", w: 1000, h: 1500 },
        layout: "grilla",
        fotos: [
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-01.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-02.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-03.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-04.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-05.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-06.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-07.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-08.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-09.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-10.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-11.jpg", w: 1500, h: 1000 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-12.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-13.jpg", w: 1000, h: 1500 },
          { src: "assets/img/proyectos/dokebi/sesiones/sesion-14.jpg", w: 1000, h: 1500 }
        ]
      }
    ]
  },
  {
    slug: "cortalab",
    nombre: "CortaLab",
    cliente: "CortaLab",
    rubro: "",
    anio: "",
    categorias: ["Audiovisual"],
    servicios: [],
    descripcion: "Descripción del proyecto pendiente.",
    sesionesIntro: "Registro audiovisual del proyecto.",
    instagram: "",
    destacado: true,
    portada: "assets/img/proyectos/cortalab/portada.jpg",
    portadaSize: [844, 1500],
    diseno: [],
    videos: [],
    series: [
      {
        slug: "workshop-garuda",
        titulo: "Workshop x Garuda",
        fecha: "2026",
        creditos: ["DIRECCIÓN DE ARTE: MONTAÑA DEPT", "FOTOGRAFÍA: [ PENDIENTE ]", "CLIENTE: CORTALAB"],
        bajada: "Registro audiovisual.",
        card: { src: "assets/img/proyectos/cortalab/portada.jpg", w: 844, h: 1500 },
        layout: "editorial",
        fotos: [
          { src: "assets/img/proyectos/cortalab/sesiones/workshop-garuda.gif", w: 360, h: 640 }
        ]
      },
      {
        slug: "master",
        titulo: "Master",
        fecha: "2026",
        creditos: ["DIRECCIÓN DE ARTE: MONTAÑA DEPT", "FOTOGRAFÍA: [ PENDIENTE ]", "CLIENTE: CORTALAB"],
        bajada: "Registro audiovisual.",
        card: { src: "assets/img/proyectos/cortalab/sesiones/master-frame.jpg", w: 844, h: 1500 },
        layout: "editorial",
        fotos: [
          { src: "assets/img/proyectos/cortalab/sesiones/master.gif", w: 360, h: 640 }
        ]
      }
    ]
  }
];
