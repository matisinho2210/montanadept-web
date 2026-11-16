/* Montaña Dept — comportamiento del sitio (vanilla JS, sin dependencias). */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  doc.documentElement.classList.add('js');

  // Prefijo para rutas: las fichas (carpeta /proyectos) usan data-base="../"
  var base = body.getAttribute('data-base') || '';
  var PROYECTOS = Array.isArray(window.PROYECTOS) ? window.PROYECTOS : [];

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function listOrDash(v) { return Array.isArray(v) && v.length ? v.join(', ') : '—'; }
  function textOrDash(v) { return v ? String(v) : '—'; }
  function isRemote(p) { return /^(https?:)?\/\//i.test(p); }
  function asset(p) { return isRemote(p) ? p : base + p; }
  function pageUrl(slug) { return (base ? '' : 'proyectos/') + slug + '.html'; }
  function igUrl(handle) { return 'https://www.instagram.com/' + String(handle).replace(/^@/, '') + '/'; }

  /* ---------- bloques de medios ---------- */
  // ratio: 'r45' (4:5), 'r43' (4:3), 'r169' (16:9)
  function frame(ratio, inner, extra) {
    return '<div class="frame ' + ratio + (extra ? ' ' + extra : '') + '">' + inner + '</div>';
  }
  function placeholder(label) {
    return '<div class="ph" role="img" aria-label="' + esc(label) + '"><span class="ph-label">' + esc(label) + '</span></div>';
  }
  function imageBlock(path, ratio, alt, pendingLabel) {
    if (!path) return frame(ratio, placeholder(pendingLabel));
    return frame(ratio, '<img src="' + esc(asset(path)) + '" alt="' + esc(alt) + '" loading="lazy">');
  }
  function videoBlock(path, alt) {
    if (!path) return frame('r169', placeholder('Video pendiente'));
    if (/\.(mp4|webm|mov)(\?.*)?$/i.test(path)) {
      return frame('r169', '<video controls playsinline preload="metadata" src="' + esc(asset(path)) +
        '" aria-label="' + esc(alt) + '"></video>');
    }
    // YouTube / Vimeo u otro link: botón que abre en pestaña nueva
    return frame('r169',
      '<a class="btn btn--dark" href="' + esc(path) + '" target="_blank" rel="noopener noreferrer">Ver video <span aria-hidden="true">↗</span></a>',
      'frame--link');
  }

  /* ---------- tarjetas de proyecto ---------- */
  function cardHTML(p, i) {
    var media = imageBlock(p.portada, 'r45', p.nombre + ', portada', 'Portada pendiente');
    return '<li><a class="card" href="' + esc(pageUrl(p.slug)) + '">' +
      '<div class="card-media">' + media + '</div>' +
      '<div class="card-body">' +
        '<span class="card-num">' + pad(i + 1) + '</span>' +
        '<div class="card-text"><h3 class="card-title">' + esc(p.nombre) + '</h3>' +
        '<p class="card-cats">' + esc((p.categorias || []).join(' · ')) + '</p></div>' +
        '<span class="card-arrow" aria-hidden="true">→</span>' +
      '</div></a></li>';
  }
  function renderCards(container, list, emptyEl) {
    container.innerHTML = list.map(cardHTML).join('');
    if (emptyEl) emptyEl.hidden = list.length > 0;
  }

  var grids = doc.querySelectorAll('[data-proyectos-grid]');
  Array.prototype.forEach.call(grids, function (grid) {
    var mode = grid.getAttribute('data-proyectos-grid');
    if (mode === 'destacados') {
      renderCards(grid, PROYECTOS.filter(function (p) { return p.destacado !== false; }));
      return;
    }
    // mode === 'todos': todos + filtro por categoría
    var emptyEl = doc.getElementById('sin-proyectos');
    var status = doc.getElementById('filtro-estado');
    var buttons = doc.querySelectorAll('[data-filter]');
    function apply(cat) {
      var list = cat === 'Todos' ? PROYECTOS : PROYECTOS.filter(function (p) {
        return (p.categorias || []).indexOf(cat) !== -1;
      });
      renderCards(grid, list, emptyEl);
      Array.prototype.forEach.call(buttons, function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-filter') === cat ? 'true' : 'false');
      });
      if (status) {
        status.textContent = list.length === 1 ? '1 proyecto' : list.length + ' proyectos';
      }
    }
    Array.prototype.forEach.call(buttons, function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
    });
    apply('Todos');
  });

  /* ---------- ficha de proyecto ---------- */
  var slug = body.getAttribute('data-proyecto');
  var root = doc.getElementById('proyecto-root');
  if (slug && root) {
    var idx = -1;
    PROYECTOS.forEach(function (p, i) { if (p.slug === slug) idx = i; });

    if (idx === -1) {
      root.innerHTML = '<section class="wrap section"><h1 class="display">Proyecto no encontrado</h1>' +
        '<p class="lead">No encontramos este proyecto.</p>' +
        '<p><a class="btn btn--dark" href="' + esc(base + 'proyectos.html') + '">Ver todos los proyectos</a></p></section>';
    } else {
      var p = PROYECTOS[idx];
      var next = PROYECTOS[(idx + 1) % PROYECTOS.length];

      doc.title = p.nombre + ' | Montaña Dept';
      var desc = p.nombre + ': ' + (p.rubro || 'proyecto') + '. Un proyecto de Montaña Dept, agencia creativa de Santiago.';
      var setMeta = function (sel, v) { var m = doc.querySelector(sel); if (m) m.setAttribute('content', v); };
      setMeta('meta[name="description"]', desc);
      setMeta('meta[property="og:title"]', doc.title);
      setMeta('meta[property="og:description"]', desc);

      var ig = p.instagram
        ? '<a href="' + esc(igUrl(p.instagram)) + '" target="_blank" rel="noopener noreferrer">' + esc(p.instagram) + '</a>'
        : '—';

      var diseno = (p.diseno || []).map(function (d, i) {
        return '<li>' + imageBlock(d, 'r43', p.nombre + ', diseño ' + (i + 1), 'Imagen pendiente') + '</li>';
      }).join('');
      var fotos = (p.fotos || []).map(function (f, i) {
        return '<li>' + imageBlock(f, 'r45', p.nombre + ', foto ' + (i + 1), 'Imagen pendiente') + '</li>';
      }).join('');
      var videos = (p.videos || []).map(function (v, i) {
        return '<li>' + videoBlock(v, p.nombre + ', video ' + (i + 1)) + '</li>';
      }).join('');

      var html =
        '<section class="wrap ficha-hero">' +
          '<a class="back-link" href="' + esc(base + 'proyectos.html') + '"><span aria-hidden="true">←</span> Proyectos</a>' +
          '<p class="eyebrow">Proyecto ' + pad(idx + 1) + '</p>' +
          '<h1 class="display">' + esc(p.nombre) + '</h1>' +
          '<div class="ficha-grid">' +
            '<div class="ficha-info">' +
              '<p class="lead">' + esc(p.descripcion) + '</p>' +
              '<dl class="meta">' +
                '<div><dt>Cliente</dt><dd>' + esc(textOrDash(p.cliente)) + '</dd></div>' +
                '<div><dt>Rubro</dt><dd>' + esc(textOrDash(p.rubro)) + '</dd></div>' +
                '<div><dt>Año</dt><dd>' + esc(textOrDash(p.anio)) + '</dd></div>' +
                '<div><dt>Categorías</dt><dd>' + esc(listOrDash(p.categorias)) + '</dd></div>' +
                '<div><dt>Servicios</dt><dd>' + esc(listOrDash(p.servicios)) + '</dd></div>' +
                '<div><dt>Instagram</dt><dd>' + ig + '</dd></div>' +
              '</dl>' +
            '</div>' +
            '<div class="ficha-cover">' + imageBlock(p.portada, 'r45', p.nombre + ', portada', 'Portada pendiente') + '</div>' +
          '</div>' +
        '</section>' +
        (diseno ? '<section class="wrap section"><h2 class="section-title">Diseño</h2><ul class="media-grid media-grid--design">' + diseno + '</ul></section>' : '') +
        (fotos ? '<section class="wrap section"><h2 class="section-title">Fotos</h2><ul class="media-grid media-grid--photos">' + fotos + '</ul></section>' : '') +
        (videos ? '<section class="wrap section"><h2 class="section-title">Video</h2><ul class="media-grid media-grid--video">' + videos + '</ul></section>' : '') +
        (PROYECTOS.length > 1
          ? '<section class="next-project"><div class="wrap">' +
              '<p class="eyebrow">Siguiente proyecto</p>' +
              '<a class="next-link" href="' + esc(pageUrl(next.slug)) + '">' +
                '<span class="next-name">' + esc(next.nombre) + '</span>' +
                '<span class="next-arrow" aria-hidden="true">→</span>' +
              '</a></div></section>'
          : '');
      root.innerHTML = html;
    }
  }

  /* ---------- menú móvil ---------- */
  var header = doc.querySelector('.site-header');
  var btn = doc.querySelector('.menu-btn');
  var menu = doc.getElementById('menu');
  if (header && btn && menu) {
    var label = btn.querySelector('.menu-btn-label');
    var setOpen = function (open) {
      header.classList.toggle('is-open', open);
      body.classList.toggle('menu-lock', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? 'Cerrar' : 'Menú';
    };
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setOpen(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
    // Si se agranda la ventana, cerramos el menú
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) setOpen(false);
    });
  }

  /* ---------- formulario de contacto ---------- */
  var form = doc.querySelector('form[data-form]');
  if (form) {
    var msg = doc.getElementById('form-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      /*
       * AQUÍ CONECTAR EL ENVÍO REAL (no hay backend todavía):
       * - Formspree: crear un form en formspree.io y hacer
       *     fetch('https://formspree.io/f/XXXXXXXX', { method: 'POST',
       *       body: new FormData(form), headers: { Accept: 'application/json' } })
       *   (ojo: la CSP de la vista previa no lo permitirá, en el sitio publicado sí).
       * - Netlify Forms: agregar data-netlify="true" y name="contacto" al <form>
       *   en contacto.html y enviar el FormData por POST a "/".
       */
      form.reset();
      if (msg) {
        msg.textContent = 'Gracias, te respondemos pronto.';
        msg.hidden = false;
      }
    });
  }
})();
