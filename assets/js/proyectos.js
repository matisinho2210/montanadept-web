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
 *        slug:        "sandwich"   // ancla #sesion-sandwich (la usa el índice de tarjetas); si falta, "serie-<n>"
 *        bajada:      "Línea 1.\nLínea 2."  // texto chico gris (2 líneas, \n = salto); su 1ª línea sale en la tarjeta del índice
 *        titular:     "Frase grande"       // titular del bloque de la serie
 *        descripcion: "Párrafo..."         // qué fue y en qué consistió la sesión (máx. ~52 caracteres por línea)
 *        datos:       [ { k: "Tipo", v: "Lifestyle" }, ... ]   // mini tabla (clave / valor)
 *        hero:        { src: "ruta.jpg", w: 2000, h: 1333, pos: "50% 60%" }  // panorámica 21:9 a ancho completo (pos = object-position); abre el visor
 *        etiquetas:   ["IZQUIERDA", "DERECHA"]  // micro-etiquetas sobre las esquinas inferiores del hero
 *        card:        { src: "ruta.jpg", w: 1333, h: 2000 }    // imagen de la tarjeta del índice; si falta usa la primera foto
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
        slug: "sandwich",
        titulo: "Sándwich",
        bajada: "Fotografía lifestyle.\nDe la plancha a la mano.",
        titular: "El Kimchicken, desde la cocina hasta la mesa.",
        descripcion: "Seguimos el sándwich estrella de Fuku en su recorrido real: el pan dorándose en la plancha, el armado y el momento en que llega a la mano. Luz cálida, manos de verdad y nada de montaje, para que se vea tan rico como es.",
        datos: [
          { k: "Tipo", v: "Lifestyle / producto" },
          { k: "Piezas", v: "05 fotos" },
          { k: "Uso", v: "Redes sociales" }
        ],
        card: { src: "assets/img/proyectos/fuku/sesiones/sandwich-03.jpg", w: 1333, h: 2000 },
        layout: "editorial",
        fotos: [
          { src: "assets/img/proyectos/fuku/sesiones/sandwich-01.jpg", w: 1333, h: 2000 },
          { src: "assets/img/proyectos/fuku/sesiones/sandwich-02.jpg", w: 1333, h: 2000 },
          { src: "assets/img/proyectos/fuku/sesiones/sandwich-03.jpg", w: 1333, h: 2000 },
          { src: "assets/img/proyectos/fuku/sesiones/sandwich-04.jpg", w: 1333, h: 2000 },
          { src: "assets/img/proyectos/fuku/sesiones/sandwich-05.jpg", w: 1500, h: 2000 }
        ]
      },
      {
        slug: "menu",
        titulo: "Menú",
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
    instagram: "@shawi_cl",
    destacado: true,
    portada: "assets/img/proyectos/shawi/sesiones/popup-01.jpg",
    portadaSize: [1500, 2000],
    diseno: [
      {
        grupo: "Redes sociales",
        titulo: "Carrusel · Pop-up en Aszú",
        layout: "carrusel",
        fotos: [
          { src: "assets/img/proyectos/shawi/sesiones/aszu-01.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/aszu-02.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/aszu-03.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/aszu-04.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/aszu-05.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/aszu-06.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/aszu-07.jpg", w: 1500, h: 2000 }
        ]
      }
    ],
    videos: [],
    series: [
      {
        titulo: "Pop-up",
        layout: "editorial",
        slug: "popup",
        bajada: "Cobertura de evento.\nPop-up del 08-09.",
        titular: "Un pop-up contado desde la plancha.",
        descripcion: "Registramos el pop-up de Shawi de principio a fin: la carne en la tabla, el armado de cada shawarma, las papas en su papel y la gente probando. Fotos directas y cercanas, para que en redes se sienta el ambiente.",
        datos: [{ k: "Tipo", v: "Cobertura de evento" }, { k: "Piezas", v: "09 fotos" }, { k: "Uso", v: "Redes sociales" }],
        card: { src: "assets/img/proyectos/shawi/sesiones/popup-01.jpg", w: 1500, h: 2000 },
        fotos: [
          { src: "assets/img/proyectos/shawi/sesiones/popup-01.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/popup-02.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/popup-03.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/popup-04.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/popup-05.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/popup-06.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/popup-07.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/popup-08.jpg", w: 1500, h: 2000 },
          { src: "assets/img/proyectos/shawi/sesiones/popup-09.jpg", w: 1500, h: 2000 }
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
  }
];
