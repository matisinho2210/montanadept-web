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
  function plural(n, one, many) { return pad(n) + ' ' + (n === 1 ? one : many); }

  /* ---------- contador fantasma ("03") ---------- */
  Array.prototype.forEach.call(doc.querySelectorAll('[data-count]'), function (el) {
    el.textContent = pad(PROYECTOS.length);
  });

  /* ---------- bloques de medios ---------- */
  // ratio: 'r11', 'r43', 'r45', 'r169'
  function frame(ratio, inner, extra) {
    return '<div class="frame ' + ratio + (extra ? ' ' + extra : '') + '">' + inner + '</div>';
  }
  function placeholder(label, alt) {
    return '<div class="ph" role="img" aria-label="' + esc(alt || label) + '"><span class="ph-label mono">[ ' + esc(label) + ' ]</span></div>';
  }
  function imageBlock(path, ratio, alt, pendingLabel) {
    if (!path) return frame(ratio, placeholder(pendingLabel, alt + ' (pendiente)'));
    return frame(ratio, '<img src="' + esc(asset(path)) + '" alt="' + esc(alt) + '" loading="lazy">');
  }
  function videoBlock(path, alt) {
    if (!path) return frame('r169', placeholder('Video pendiente', alt + ' (pendiente)'));
    if (/\.(mp4|webm|mov)(\?.*)?$/i.test(path)) {
      return frame('r169', '<video controls playsinline preload="metadata" src="' + esc(asset(path)) +
        '" aria-label="' + esc(alt) + '"></video>');
    }
    // YouTube / Vimeo u otro link: botón que abre en pestaña nueva
    return frame('r169',
      '<a class="btn-ink" href="' + esc(path) + '" target="_blank" rel="noopener noreferrer">Ver video <span aria-hidden="true">↗</span><span class="sr-only">(se abre en una pestaña nueva)</span></a>',
      'frame--link');
  }

  /* ---------- índice (filas) y grilla de proyectos ---------- */
  function rowHTML(p) {
    var i = PROYECTOS.indexOf(p);
    return '<li><a class="row" href="' + esc(pageUrl(p.slug)) + '" data-i="' + i + '">' +
      '<span class="c-num mono">(' + pad(i + 1) + ')</span>' +
      '<span class="c-name">' + esc(p.nombre) + '</span>' +
      '<span class="c-rubro mono">' + esc(textOrDash(p.rubro)) + '</span>' +
      '<span class="c-cats mono">' + esc(listOrDash(p.categorias)) + '</span>' +
      '<span class="c-year mono">' + esc(textOrDash(p.anio)) + '</span>' +
      '<span class="c-arrow" aria-hidden="true">→</span></a></li>';
  }
  function gridCardHTML(p) {
    var i = PROYECTOS.indexOf(p);
    var cap = '(' + pad(i + 1) + ') ' + p.nombre + ' — ' + listOrDash(p.categorias);
    return '<li><a class="pcard" href="' + esc(pageUrl(p.slug)) + '">' +
      imageBlock(p.portada, 'r45', p.nombre + ', portada', 'Portada pendiente') +
      '<span class="cap mono">' + esc(cap) + '</span></a></li>';
  }

  /* miniatura que sigue al cursor (solo escritorio con mouse) */
  var thumb = null;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (min-width: 900px)');
  function ensureThumb() {
    if (thumb) return thumb;
    thumb = doc.createElement('div');
    thumb.className = 'hover-thumb';
    thumb.setAttribute('aria-hidden', 'true');
    body.appendChild(thumb);
    return thumb;
  }
  function bindThumb(list) {
    list.addEventListener('mouseover', function (e) {
      if (!canHover || !canHover.matches) return;
      var row = e.target.closest ? e.target.closest('.row') : null;
      if (!row) return;
      var p = PROYECTOS[Number(row.getAttribute('data-i'))];
      if (!p) return;
      var t = ensureThumb();
      t.innerHTML = p.portada
        ? '<img src="' + esc(asset(p.portada)) + '" alt="">'
        : placeholder('Portada pendiente', 'Portada pendiente');
      t.classList.add('on');
    });
    list.addEventListener('mousemove', function (e) {
      if (!thumb || !thumb.classList.contains('on')) return;
      var x = e.clientX + 32;
      if (x + 240 > window.innerWidth) x = e.clientX - 272;
      var y = Math.max(8, Math.min(e.clientY - 150, window.innerHeight - 308));
      thumb.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    });
    list.addEventListener('mouseleave', function () { if (thumb) thumb.classList.remove('on'); });
  }

  var indexes = doc.querySelectorAll('[data-proyectos-index]');
  var gridEl = doc.querySelector('[data-proyectos-grid]');
  Array.prototype.forEach.call(indexes, function (ul) {
    bindThumb(ul);
    if (ul.getAttribute('data-proyectos-index') === 'destacados') {
      ul.innerHTML = PROYECTOS.filter(function (p) { return p.destacado !== false; }).map(rowHTML).join('');
    }
  });

  // Página Proyectos: filtro por categoría + vista lista/grilla (la vista se recuerda en esta variable)
  var listUl = doc.querySelector('[data-proyectos-index="todos"]');
  if (listUl) {
    var vista = 'lista';
    var cat = 'Todos';
    var emptyEl = doc.getElementById('sin-proyectos');
    var status = doc.getElementById('filtro-estado');
    var head = doc.getElementById('idx-head');
    var fbtns = doc.querySelectorAll('[data-filter]');
    var vbtns = doc.querySelectorAll('[data-view]');
    var render = function () {
      var list = cat === 'Todos' ? PROYECTOS : PROYECTOS.filter(function (p) {
        return (p.categorias || []).indexOf(cat) !== -1;
      });
      listUl.innerHTML = list.map(rowHTML).join('');
      if (gridEl) gridEl.innerHTML = list.map(gridCardHTML).join('');
      listUl.hidden = vista !== 'lista' || !list.length;
      if (head) head.hidden = vista !== 'lista' || !list.length;
      if (gridEl) gridEl.hidden = vista !== 'grilla' || !list.length;
      if (emptyEl) emptyEl.hidden = list.length > 0;
      Array.prototype.forEach.call(fbtns, function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-filter') === cat ? 'true' : 'false');
      });
      Array.prototype.forEach.call(vbtns, function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-view') === vista ? 'true' : 'false');
      });
      if (status) status.textContent = '[ ' + plural(list.length, 'proyecto', 'proyectos') + ' ]';
    };
    Array.prototype.forEach.call(fbtns, function (b) {
      b.addEventListener('click', function () { cat = b.getAttribute('data-filter'); render(); });
    });
    Array.prototype.forEach.call(vbtns, function (b) {
      b.addEventListener('click', function () { vista = b.getAttribute('data-view'); render(); });
    });
    render();
  }

  /* ---------- ficha de proyecto ---------- */
  // Diagramación asimétrica que se repite: A (1:1 + 4:3), B (4:5 + 4:5), C (16:9 ancho completo)
  var PATRONES = [
    { k: 'a', ratios: ['r11', 'r43'] },
    { k: 'b', ratios: ['r45', 'r45'] },
    { k: 'c', ratios: ['r169'] }
  ];
  // items: [{ html: function(ratio), forceFull: bool }]
  function galleryRows(items) {
    var out = '';
    var n = 0;
    var pi = 0;
    var pos = 0;
    var cap = function (k) { return '<figcaption class="mono">(' + pad(k) + ')</figcaption>'; };
    var fullRow = function (it) {
      n += 1;
      return '<div class="gal-row gal-row--c"><figure class="g1">' + it.html('r169') + cap(n) + '</figure></div>';
    };
    var normal = items.filter(function (it) { return !it.forceFull; });
    var forced = items.filter(function (it) { return it.forceFull; });
    while (pos < normal.length) {
      var pat = PATRONES[pi % PATRONES.length];
      var need = pat.ratios.length;
      var chunk = normal.slice(pos, pos + need);
      if (chunk.length < need) { // fila incompleta: ancho completo
        out += chunk.map(fullRow).join('');
        break;
      }
      out += '<div class="gal-row gal-row--' + pat.k + '">' + chunk.map(function (it, j) {
        n += 1;
        return '<figure class="g' + (j + 1) + '">' + it.html(pat.ratios[j]) + cap(n) + '</figure>';
      }).join('') + '</div>';
      pos += need; pi += 1;
    }
    return out + forced.map(fullRow).join('');
  }
  function gallery(title, items, id) {
    if (!items.length) return '';
    return '<section class="gal" aria-labelledby="' + id + '" data-rv>' +
      '<div class="gal-label mono"><h2 id="' + id + '">' + esc(title) + ' — ' + plural(items.length, 'pieza', 'piezas') + '</h2><span aria-hidden="true">[ ↓ ]</span></div>' +
      galleryRows(items) + '</section>';
  }

  var slug = body.getAttribute('data-proyecto');
  var root = doc.getElementById('proyecto-root');
  if (slug && root) {
    var idx = -1;
    PROYECTOS.forEach(function (p, i) { if (p.slug === slug) idx = i; });

    if (idx === -1) {
      root.innerHTML = '<section class="grid page-head page-head--plain"><p class="mono page-label">[ 404 ]</p>' +
        '<h1 class="display page-title">Proyecto no encontrado</h1>' +
        '<p class="page-lead">No encontramos este proyecto.</p>' +
        '<p class="nf-link"><a class="link-under" href="' + esc(base + 'proyectos.html') + '">Ver todos los proyectos <span aria-hidden="true">→</span></a></p></section>';
    } else {
      var p = PROYECTOS[idx];
      var total = PROYECTOS.length;
      var prev = PROYECTOS[(idx - 1 + total) % total];
      var next = PROYECTOS[(idx + 1) % total];

      doc.title = p.nombre + ' | Montaña Dept';
      var desc = p.nombre + ': ' + (p.rubro || 'proyecto') + '. Un proyecto de Montaña Dept, agencia creativa de Santiago.';
      var setMeta = function (sel, v) { var m = doc.querySelector(sel); if (m) m.setAttribute('content', v); };
      setMeta('meta[name="description"]', desc);
      setMeta('meta[property="og:title"]', doc.title);
      setMeta('meta[property="og:description"]', desc);

      var ig = p.instagram
        ? '<a href="' + esc(igUrl(p.instagram)) + '" target="_blank" rel="noopener noreferrer">' + esc(p.instagram) + '</a>'
        : '—';
      var tipo = (p.categorias || []).concat(p.servicios || []);
      var tipoHTML = tipo.length ? '<ul>' + tipo.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '—';

      var diseno = (p.diseno || []).map(function (d, i) {
        return { html: function (r) { return imageBlock(d, r, p.nombre + ', diseño ' + (i + 1), 'Imagen pendiente'); } };
      });
      var sesiones = (p.fotos || []).map(function (f, i) {
        return { html: function (r) { return imageBlock(f, r, p.nombre + ', foto ' + (i + 1), 'Imagen pendiente'); } };
      }).concat((p.videos || []).map(function (v, i) {
        return { forceFull: true, html: function () { return videoBlock(v, p.nombre + ', video ' + (i + 1)); } };
      }));

      var navLink = function (q, dir) {
        return '<a href="' + esc(pageUrl(q.slug)) + '"><span class="mono">' + (dir === 'prev' ? '← Anterior' : 'Siguiente →') +
          '</span><span class="nm">' + esc(q.nombre) + '</span></a>';
      };

      root.innerHTML =
        '<section class="grid fx-top" data-rv>' +
          '<div class="fx-head">' +
            '<div class="fx-bar mono"><span><span aria-hidden="true">→</span> Proyecto ' + pad(idx + 1) + ' / ' + pad(total) + '</span>' +
              '<a href="' + esc(base + 'proyectos.html') + '"><span aria-hidden="true">←</span> Proyectos</a></div>' +
            '<p class="fx-num" aria-hidden="true">' + pad(idx + 1) + '</p>' +
            '<h1 class="fx-title">' + esc(p.nombre) + '</h1>' +
          '</div>' +
          '<div class="fx-cover">' + imageBlock(p.portada, 'r45', p.nombre + ', portada', 'Portada pendiente') + '</div>' +
          '<div class="fx-meta">' +
            '<div class="fx-block"><h2 class="fx-label mono">[ Ficha ]</h2><dl class="fx-body fx-table">' +
              '<div><dt class="mono">Cliente</dt><dd>' + esc(textOrDash(p.cliente)) + '</dd></div>' +
              '<div><dt class="mono">Año</dt><dd>' + esc(textOrDash(p.anio)) + '</dd></div>' +
              '<div><dt class="mono">Rubro</dt><dd>' + esc(textOrDash(p.rubro)) + '</dd></div>' +
              '<div><dt class="mono">Tipo</dt><dd>' + tipoHTML + '</dd></div>' +
              '<div><dt class="mono">Instagram</dt><dd>' + ig + '</dd></div>' +
            '</dl></div>' +
            '<div class="fx-block fx-block--info"><h2 class="fx-label mono">[ Info ]</h2><p class="fx-body">' + esc(p.descripcion) + '</p></div>' +
          '</div>' +
        '</section>' +
        gallery('Diseño', diseno, 'g-diseno') +
        gallery('Sesiones', sesiones, 'g-sesiones') +
        (total > 1
          ? '<nav class="fx-next" aria-label="Más proyectos" data-rv>' + navLink(prev, 'prev') + navLink(next, 'next') + '</nav>'
          : '');
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
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) setOpen(false);
    });
  }

  /* ---------- reloj de Santiago ---------- */
  var reloj = doc.getElementById('reloj');
  if (reloj) {
    var fmt = null;
    try {
      fmt = new Intl.DateTimeFormat('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    } catch (err) { fmt = null; }
    var tick = function () {
      if (!fmt) return;
      reloj.textContent = 'SCL ' + fmt.format(new Date()).replace(/\s/g, '');
    };
    tick();
    window.setInterval(tick, 30000);
  }

  /* ---------- aparición suave al entrar en pantalla ---------- */
  var reveals = doc.querySelectorAll('[data-rv]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
  } else {
    // lo que ya está a la vista al cargar se muestra sin animar
    Array.prototype.forEach.call(reveals, function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in', 'now');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.05 });
    Array.prototype.forEach.call(reveals, function (el) { if (!el.classList.contains('in')) io.observe(el); });
  }

  /* ---------- formulario de contacto ---------- */
  /*
   * Sin backend: al enviar se arma un enlace mailto: con todos los campos y se
   * muestra un bloque "Tu mensaje está listo" (enlace + copiar mensaje).
   *
   * PARA REEMPLAZAR POR FORMSPREE (futuro):
   *  1. Crear el formulario en formspree.io y copiar su URL (https://formspree.io/f/XXXXXXXX).
   *  2. En contacto.html poner action="https://formspree.io/f/XXXXXXXX" method="post" en el <form>.
   *  3. En el submit, en vez de armar el mailto, hacer:
   *       fetch(form.action, { method: 'POST', body: new FormData(form),
   *         headers: { Accept: 'application/json' } })
   *         .then(function (r) { mostrar éxito si r.ok, o error si no; });
   *  4. Permitir https://formspree.io en connect-src de la CSP del sitio publicado
   *     (la vista previa en iframe lo bloqueará).
   */
  var form = doc.querySelector('form[data-form]');
  if (form) {
    var ready = doc.getElementById('form-ready');
    var mailLink = doc.getElementById('form-mailto');
    var copyBtn = doc.getElementById('form-copy');
    var mailBody = '';
    var copyTimer = null;
    var val = function (name) {
      var el = form.elements[name];
      return el ? String(el.value || '').trim() : '';
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var quien = val('empresa') || val('nombre');
      var subject = 'Nuevo proyecto — ' + quien;
      mailBody = 'Nombre: ' + val('nombre') + '\n' +
        'Correo: ' + val('correo') + '\n' +
        'Empresa o marca: ' + (val('empresa') || '—') + '\n' +
        'Qué necesita: ' + val('necesidad') + '\n\n' +
        'Mensaje:\n' + val('mensaje');
      if (mailLink) {
        mailLink.href = 'mailto:contacto@montanadept.com?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(mailBody);
      }
      if (copyBtn) copyBtn.textContent = 'Copiar mensaje';
      if (ready) {
        ready.hidden = false;
        if (mailLink && mailLink.scrollIntoView) mailLink.scrollIntoView({ block: 'nearest' });
      }
    });
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var text = 'Para: contacto@montanadept.com\n\n' + mailBody;
        var done = function (ok) {
          copyBtn.textContent = ok ? 'Copiado' : 'No se pudo copiar';
          window.clearTimeout(copyTimer);
          copyTimer = window.setTimeout(function () { copyBtn.textContent = 'Copiar mensaje'; }, 2500);
        };
        try {
          if (!navigator.clipboard || !navigator.clipboard.writeText) { done(false); return; }
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        } catch (err) { done(false); }
      });
    }
  }
})();
