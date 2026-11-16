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
    servicios: [],
    descripcion: "Descripción del proyecto pendiente.",
    instagram: "@fuku_kf",
    destacado: true,
    portada: "",
    diseno: ["", "", "", ""],
    fotos: ["", "", "", ""],
    videos: [""]
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
    portada: "",
    diseno: ["", "", "", ""],
    fotos: ["", "", "", ""],
    videos: [""]
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
