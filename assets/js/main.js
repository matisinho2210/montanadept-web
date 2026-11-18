/* Montaña Dept — comportamiento del sitio (vanilla JS, sin dependencias). */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  doc.documentElement.classList.add('js');

  /* Salvaguarda: sin #ancla, toda página abre arriba (también en iframes y al volver con atrás/adelante) */
  function toTop() { if (!location.hash) window.scrollTo(0, 0); }
  if ('scrollRestoration' in history) { try { history.scrollRestoration = 'manual'; } catch (err) { /* sin control */ } }
  toTop();
  window.addEventListener('pageshow', function (e) { if (e.persisted || !location.hash) toTop(); });
  window.addEventListener('load', function () { window.setTimeout(toTop, 0); });

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
  // opts: { eager: bool, size: [w, h] }
  function imageBlock(path, ratio, alt, pendingLabel, opts) {
    if (!path) return frame(ratio, placeholder(pendingLabel, alt + ' (pendiente)'));
    opts = opts || {};
    var dim = opts.size ? ' width="' + Number(opts.size[0]) + '" height="' + Number(opts.size[1]) + '"' : '';
    var load = opts.eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
    return frame(ratio, '<img src="' + esc(asset(path)) + '" alt="' + esc(alt) + '"' + dim + load + ' decoding="async">');
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

  /* ---------- miniaturas de cada proyecto (para la lista expandible y la ficha) ---------- */
  function okFoto(f) { return f && f.src; }
  // Imagen fija de una pieza: el póster si es video, la propia imagen si no
  function stillOf(f) { return f && f.video && f.poster ? { src: f.poster, w: f.w, h: f.h } : f; }
  var PLAY_TAG = '<span class="play-tag mono" aria-hidden="true">▶</span>';
  function dimsOf(f) {
    var w = Number(f.w), h = Number(f.h);
    return isFinite(w) && isFinite(h) && w > 0 && h > 0 ? [w, h] : null;
  }
  // [{ src, w, h, linea2, linea3, href }] sin repetir, hasta "max"; la portada va primero
  function projThumbs(p, max, sinPortada) {
    var out = [];
    var seen = {};
    var page = pageUrl(p.slug);
    if (sinPortada && p.portada) seen[p.portada] = true;
    var add = function (f, l2, l3, hash) {
      if (!okFoto(f)) return;
      var vid = !!(f.video && f.poster);
      f = stillOf(f);
      if (seen[f.src] || out.length >= max) return;
      seen[f.src] = true;
      var d = dimsOf(f);
      out.push({ src: f.src, video: vid, w: d ? d[0] : 0, h: d ? d[1] : 0, linea2: l2, linea3: l3, href: page + (hash ? '#' + hash : '') });
    };
    var series = Array.isArray(p.series) ? p.series : [];
    var dis = Array.isArray(p.diseno) ? p.diseno.filter(function (s) { return s && Array.isArray(s.fotos); }) : [];
    var tipoDe = function (s) {
      var t = (s.datos || []).filter(function (d) { return d && d.k === 'Tipo'; })[0];
      return t ? t.v : 'Sesión de fotos';
    };
    var hashDe = function (s, si) { return serieAnchor(s, si); };
    if (p.portada && !sinPortada) {
      add({ src: p.portada, w: p.portadaSize && p.portadaSize[0], h: p.portadaSize && p.portadaSize[1] }, 'Portada', listOrDash(p.categorias), '');
    }
    series.forEach(function (s, si) {
      var f = (s.fotos || []).filter(okFoto)[0];
      add(f, s.titulo || 'Sesión', tipoDe(s), hashDe(s, si));
    });
    dis.forEach(function (s) {
      add((s.fotos || []).filter(okFoto)[0], s.titulo || 'Diseño', s.grupo || 'Diseño', '');
    });
    series.forEach(function (s, si) { // relleno con más fotos de las sesiones
      (s.fotos || []).filter(okFoto).forEach(function (f) { add(f, s.titulo || 'Sesión', tipoDe(s), hashDe(s, si)); });
    });
    return out;
  }
  function pcode(i) { return 'P' + ('00' + (i + 1)).slice(-3); }

  /* ---------- lista expandible (P001 FUKU — RUBRO — CATEGORÍAS — AÑO) ---------- */
  function bandHTML(p, id) {
    var th = projThumbs(p, 5, false);
    var lis = '';
    if (!th.length) {
      for (var k = 0; k < 5; k++) {
        lis += '<li class="pt"><figure><div class="pt-img">' + placeholder('Imagen pendiente', p.nombre + ', imagen pendiente') + '</div>' +
          '<figcaption class="pt-cap mono"><span>' + esc(p.nombre) + '</span><span>Pendiente</span><span>' + esc(listOrDash(p.categorias)) + '</span></figcaption></figure></li>';
      }
    } else {
      th.forEach(function (t, k) {
        var dim = t.w ? ' width="' + t.w + '" height="' + t.h + '"' : '';
        lis += '<li class="pt"><figure><a class="pt-img" href="' + esc(t.href) + '" aria-label="' + esc(p.nombre + ' — ' + t.linea2) + '">' +
          '<img src="' + esc(asset(t.src)) + '" alt=""' + dim + ' loading="lazy" decoding="async">' + (t.video ? PLAY_TAG : '') + '</a>' +
          '<figcaption class="pt-cap mono"><span>' + esc(p.nombre) + '</span><span>' + esc(t.linea2) + '</span><span>' + esc(t.linea3) + '</span></figcaption></figure></li>';
      });
    }
    return '<div class="pband" id="' + id + '"><ul class="pthumbs">' + lis + '</ul>' +
      '<p class="pband-link"><a class="link-under" href="' + esc(pageUrl(p.slug)) + '">Ver proyecto <span aria-hidden="true">→</span><span class="sr-only">: ' + esc(p.nombre) + '</span></a></p></div>';
  }
  function plistHTML(list, prefix) {
    return list.map(function (p, k) {
      var i = PROYECTOS.indexOf(p);
      var open = k === 0;
      var bid = prefix + '-band-' + i;
      return '<li class="pitem"><h3 class="prow-h"><button class="prow" type="button" aria-expanded="' + (open ? 'true' : 'false') + '" aria-controls="' + bid + '">' +
        '<span class="pr-n">' + pcode(i) + '</span>' +
        '<span class="pr-name">' + esc(p.nombre) + '</span>' +
        '<span class="pr-rubro">' + esc(textOrDash(p.rubro)) + '</span>' +
        '<span class="pr-cats">' + esc(listOrDash(p.categorias)) + '</span>' +
        '<span class="pr-year">' + esc(textOrDash(p.anio)) + '</span>' +
        '<span class="pr-ch" aria-hidden="true">▾</span></button></h3>' +
        bandHTML(p, bid).replace('class="pband"', 'class="pband"' + (open ? '' : ' hidden')) + '</li>';
    }).join('');
  }
  function syncExpandBtn(ul) {
    var btn = doc.querySelector('[data-expand-for="' + ul.id + '"]');
    if (!btn) return;
    var rows = ul.querySelectorAll('.prow');
    var all = rows.length > 0 && Array.prototype.every.call(rows, function (r) { return r.getAttribute('aria-expanded') === 'true'; });
    btn.querySelector('.plist-all-t').textContent = all ? 'Contraer' : 'Expandir todo';
    btn.querySelector('.plist-all-i').textContent = all ? '▴' : '▾';
    btn.hidden = rows.length < 2;
  }
  function setRow(row, open) {
    row.setAttribute('aria-expanded', open ? 'true' : 'false');
    var band = doc.getElementById(row.getAttribute('aria-controls'));
    if (band) band.hidden = !open;
  }
  function fillPlist(ul, list) {
    ul.innerHTML = plistHTML(list, ul.id);
    syncExpandBtn(ul);
  }
  function bindPlists() {
    doc.addEventListener('click', function (e) {
      var row = e.target.closest ? e.target.closest('.prow') : null;
      if (row) {
        setRow(row, row.getAttribute('aria-expanded') !== 'true');
        var ul = row.closest('.plist');
        if (ul) syncExpandBtn(ul);
        return;
      }
      var all = e.target.closest ? e.target.closest('[data-expand-for]') : null;
      if (all) {
        var list = doc.getElementById(all.getAttribute('data-expand-for'));
        if (!list) return;
        var rows = list.querySelectorAll('.prow');
        var every = Array.prototype.every.call(rows, function (r) { return r.getAttribute('aria-expanded') === 'true'; });
        Array.prototype.forEach.call(rows, function (r) { setRow(r, !every); });
        syncExpandBtn(list);
      }
    });
  }
  bindPlists();

  /* ---------- grilla cuadrada y tira ---------- */
  function gridCardHTML(p) {
    var i = PROYECTOS.indexOf(p);
    var cap = '(' + pad(i + 1) + ') ' + p.nombre + ' — ' + listOrDash(p.categorias);
    return '<li><a class="ptile" href="' + esc(pageUrl(p.slug)) + '" aria-label="' + esc(p.nombre + ' — ' + listOrDash(p.categorias)) + '">' +
      imageBlock(p.portada, 'r11', p.nombre + ', portada', 'Portada pendiente', { size: p.portadaSize }).replace('alt="' + esc(p.nombre + ', portada') + '"', 'alt=""') +
      '<span class="ptile-cap mono" aria-hidden="true">' + esc(cap) + '</span></a></li>';
  }
  function tiraItemHTML(p, k) {
    var i = PROYECTOS.indexOf(p);
    var img = p.portada
      ? '<img src="' + esc(asset(p.portada)) + '" alt="" loading="lazy" decoding="async">'
      : placeholder('Pendiente', 'Portada pendiente');
    return '<li class="tira-item' + (k === 0 ? ' is-active' : '') + '"><a href="' + esc(pageUrl(p.slug)) + '">' +
      '<span class="tira-cap mono"><span class="tira-n">(' + pad(i + 1) + ')</span><span>' + esc(p.nombre) + '</span><span>' + esc(textOrDash(p.rubro)) + '</span><span>' + esc(listOrDash(p.categorias)) + '</span></span>' +
      '<span class="tira-img">' + img + '</span></a></li>';
  }
  function bindTira(track, countEl) {
    var setActive = function (li) {
      var items = track.querySelectorAll('.tira-item');
      Array.prototype.forEach.call(items, function (x) { x.classList.toggle('is-active', x === li); });
      if (countEl) countEl.textContent = pad(Array.prototype.indexOf.call(items, li) + 1) + ' / ' + pad(items.length) + '  ← →';
    };
    track.addEventListener('mouseover', function (e) {
      var li = e.target.closest ? e.target.closest('.tira-item') : null;
      if (li && !li.classList.contains('is-active')) setActive(li);
    });
    track.addEventListener('focusin', function (e) {
      var li = e.target.closest ? e.target.closest('.tira-item') : null;
      if (li && !li.classList.contains('is-active')) setActive(li);
    });
    track.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var links = Array.prototype.slice.call(track.querySelectorAll('.tira-item a'));
      var cur = links.indexOf(doc.activeElement);
      if (cur < 0) return;
      e.preventDefault();
      var n = Math.max(0, Math.min(links.length - 1, cur + (e.key === 'ArrowRight' ? 1 : -1)));
      links[n].focus();
    });
    track.resetActive = function () {
      var first = track.querySelector('.tira-item');
      if (first) setActive(first);
    };
  }

  // Página Proyectos: filtro por servicio + vistas grilla / lista / tira
  var listUl = doc.querySelector('[data-plist="todos"]');
  if (listUl) {
    var gridEl = doc.querySelector('[data-proyectos-grid]');
    var tiraEl = doc.querySelector('[data-proyectos-tira]');
    var tiraCount = doc.getElementById('tira-count');
    var desk = window.matchMedia ? window.matchMedia('(min-width: 1080px)') : { matches: true };
    var vista = 'lista';
    var cat = 'Todos';
    var emptyEl = doc.getElementById('sin-proyectos');
    var status = doc.getElementById('filtro-estado');
    var fbtns = doc.querySelectorAll('[data-filter]');
    var vbtns = doc.querySelectorAll('[data-view]');
    var views = { grilla: doc.getElementById('v-grilla'), lista: doc.getElementById('v-lista'), tira: doc.getElementById('v-tira') };
    if (tiraEl) bindTira(tiraEl, tiraCount);
    var render = function () {
      var list = cat === 'Todos' ? PROYECTOS : PROYECTOS.filter(function (p) {
        return (p.categorias || []).indexOf(cat) !== -1;
      });
      fillPlist(listUl, list);
      if (gridEl) gridEl.innerHTML = list.map(gridCardHTML).join('');
      if (tiraEl) { tiraEl.innerHTML = list.map(tiraItemHTML).join(''); tiraEl.resetActive(); }
      Object.keys(views).forEach(function (k) { if (views[k]) views[k].hidden = k !== vista || !list.length; });
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
    var onDesk = function () { if (!desk.matches && vista === 'tira') { vista = 'lista'; render(); } };
    if (desk.addEventListener) desk.addEventListener('change', onDesk);
    else if (desk.addListener) desk.addListener(onDesk);
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

  /* ---------- series de fotos (sesiones) ---------- */
  function photoBtn(cls, f, alt, grp, title, ar) {
    var w = Number(f.w), h = Number(f.h), dims = isFinite(w) && isFinite(h) && w > 0 && h > 0;
    return '<button type="button" class="lb-open ' + cls + '" data-lb="' + esc(grp) + '" data-lb-title="' + esc(title) + '"' +
      (ar && dims ? ' data-ar="' + w + '/' + h + '"' : '') +
      (f.video ? ' data-lb-video="' + esc(asset(f.src)) + '"' : '') +
      ' aria-label="' + esc((f.video ? 'Ver video: ' : 'Ampliar: ') + alt) + '">' +
      '<img src="' + esc(asset(f.video && f.poster ? f.poster : f.src)) + '" alt="' + esc(alt) + '"' + (dims ? ' width="' + w + '" height="' + h + '"' : '') +
      ' loading="lazy" decoding="async">' + (f.video ? PLAY_TAG : '') + '</button>';
  }
  // Video de una sesión (vista expandida): sin src hasta que la fila se abre; w/h reservan el espacio
  function sesVideoTag(f, alt, dims, w, h) {
    if (!f.video) return '';
    return '<video class="ses-vid" controls playsinline muted loop preload="none" data-src="' + esc(asset(f.src)) + '"' +
      (f.poster ? ' poster="' + esc(asset(f.poster)) + '"' : '') + (dims ? ' width="' + w + '" height="' + h + '"' : '') +
      ' aria-label="' + esc(alt + ' (video)') + '"></video>';
  }
  // Videos de las sesiones: cargan al abrir la fila, se reproducen solo si se ven (>= 50 %) y hay movimiento permitido
  var sesIO = null;
  function sesPlay(v) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
  function sesStop(v) { v.dataset.sys = String(Date.now()); v.pause(); }
  function sesVideoSync(row) {
    var open = row.classList.contains('is-open');
    Array.prototype.forEach.call(row.querySelectorAll('.ses-vid'), function (v) {
      if (!open) { sesStop(v); return; }
      if (!v.getAttribute('src')) { v.preload = 'metadata'; v.src = v.getAttribute('data-src'); }
      if (sesIO) { sesIO.unobserve(v); sesIO.observe(v); }
    });
  }
  function initSesVideos(scope) {
    var vids = scope.querySelectorAll('.ses-vid');
    if (!vids.length) return;
    Array.prototype.forEach.call(vids, function (v) {
      v.muted = true;
      v.addEventListener('pause', function () { if (Date.now() - Number(v.dataset.sys || 0) > 400) v.dataset.userPaused = '1'; });
      v.addEventListener('play', function () { delete v.dataset.userPaused; });
    });
    if ('IntersectionObserver' in window) {
      sesIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          var row = v.closest('.ses-row');
          if (en.intersectionRatio >= 0.5 && row && row.classList.contains('is-open')) {
            if (motionOK() && !v.dataset.userPaused && v.paused) sesPlay(v);
          } else if (!v.paused) {
            sesStop(v);
          }
        });
      }, { threshold: [0, 0.5] });
    }
    Array.prototype.forEach.call(scope.querySelectorAll('.ses-row.is-open'), sesVideoSync);
  }
  // Retícula editorial: pares 6+6; impar suelta a la izquierda (1–6); tres seguidas 4+4+4; horizontales a ancho completo
  function editorialRows(fotos, cell) {
    var out = '';
    var buf = [];
    var row = function (cls, cells) { return '<div class="gal-row gal-row--ed ' + cls + '">' + cells.join('') + '</div>'; };
    var flush = function () {
      if (!buf.length) return;
      if (buf.length === 3) {
        out += row('ed-3', buf.map(function (b, j) { return cell(b.f, b.i, 'g' + (j + 1)); }));
      } else {
        for (var k = 0; k < buf.length; k += 2) {
          if (k + 1 < buf.length) {
            out += row('ed-2', [cell(buf[k].f, buf[k].i, 'g1'), cell(buf[k + 1].f, buf[k + 1].i, 'g2')]);
          } else {
            out += row('ed-1c', [cell(buf[k].f, buf[k].i, 'g1')]);
          }
        }
      }
      buf = [];
    };
    fotos.forEach(function (f, i) {
      if (Number(f.w) >= Number(f.h)) { flush(); out += row('ed-1', [cell(f, i, 'g1')]); }
      else buf.push({ f: f, i: i });
    });
    flush();
    return out;
  }
  function serieAnchor(serie, si) {
    var s = String(serie.slug || '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    return 'sesion-' + (s || 'serie-' + (si + 1));
  }
  function serieFotos(s) { return (s.fotos || []).filter(function (f) { return f && f.src; }); }
  function serieTipo(s) {
    var t = (s.datos || []).filter(function (d) { return d && d.k === 'Tipo' && d.v; })[0];
    return t ? t.v : 'Sesión';
  }
  // Portadas (ref. A): título grande + texto + botón; tarjetas en 4 columnas con alturas alternadas (impares 3:4, pares 1:1)
  function seriesCovers(p) {
    var cards = [];
    p.series.forEach(function (s, si) {
      var fotos = serieFotos(s);
      if (!fotos.length) return;
      var img = s.card && s.card.src ? s.card : stillOf(fotos[0]);
      var vid = !!(fotos[0] && fotos[0].video);
      var w = Number(img.w), h = Number(img.h), dims = isFinite(w) && isFinite(h) && w > 0 && h > 0;
      var titulo = s.titulo || ('Serie ' + pad(si + 1));
      var desc = String(s.bajada || s.descripcion || '').replace(/\s*\n\s*/g, ' ').trim();
      var k = cards.length;
      cards.push('<li class="ses-card ' + (k % 2 === 0 ? 'ses-card--tall' : 'ses-card--sq') + '">' +
        '<span class="ses-card-img"><img src="' + esc(asset(img.src)) + '" alt=""' + (dims ? ' width="' + w + '" height="' + h + '"' : '') + ' loading="lazy" decoding="async">' + (vid ? PLAY_TAG : '') + '</span>' +
        '<h4 class="ses-card-t">' + esc(titulo) + '</h4>' +
        (desc ? '<p class="ses-card-d">' + esc(desc) + '</p>' : '') +
        '<a class="ses-card-l mono" href="#' + esc(serieAnchor(s, si)) + '" data-ses-link>Ver sesión <span aria-hidden="true">↗</span>' +
        '<span class="sr-only">: ' + esc(titulo) + '</span></a></li>');
    });
    if (!cards.length) return '';
    return '<div class="ses-head">' +
        '<p class="ses-h" aria-hidden="true">Sesiones</p><h3 class="sr-only">Portadas de las sesiones</h3>' +
        '<p class="ses-lead">' + esc(String(p.sesionesIntro || '').trim() || 'Cada sesión parte de una idea simple y la desarrollamos en fotos.') + '</p>' +
        '<a class="ses-all mono" href="#sesiones-indice" data-ses-link>Ver todas <span aria-hidden="true">↓</span></a>' +
      '</div><ul class="ses-covers">' + cards.join('') + '</ul>';
  }
  // Índice por carpetas (ref. B): una fila por serie; hoja de contacto, imágenes grandes o créditos
  function seriesFolders(p) {
    var rows = [];
    p.series.forEach(function (s, si) {
      var fotos = serieFotos(s);
      if (!fotos.length) return;
      var titulo = s.titulo || ('Serie ' + pad(si + 1));
      var grp = 'serie-' + si;
      var id = serieAnchor(s, si);
      var open = false;
      var meta = String(p.cliente || p.nombre).toLocaleUpperCase('es') + ' | ' + String(serieTipo(s)).toLocaleUpperCase('es');
      var figs = fotos.map(function (f, i) {
        var w = Number(f.w), h = Number(f.h), dims = isFinite(w) && isFinite(h) && w > 0 && h > 0;
        var alt = p.nombre + ' — ' + titulo + ', foto ' + (i + 1);
        return '<li class="ses-fig"><figure><div class="ses-ph"' + (dims ? ' data-ar="' + w + '/' + h + '"' : '') + '>' +
          photoBtn('ses-ph-btn', f, alt, grp, titulo, false) + sesVideoTag(f, alt, dims, w, h) + '</div>' +
          '<figcaption class="mono">(' + pad(i + 1) + ')</figcaption></figure></li>';
      }).join('');
      rows.push('<li class="ses-row' + (open ? ' is-open' : '') + '" id="' + esc(id) + '">' +
        '<div class="ses-side">' +
          '<h4 class="ses-name mono" tabindex="-1"><span>' + esc(titulo) + '</span></h4>' +
          '<p class="ses-meta mono">' + esc(meta) + '</p>' +
          '<div class="ses-foot mono">' +
            '<span class="ses-year">' + esc(s.fecha || '') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="ses-main" id="' + esc(id) + '-pics">' +
          '<ul class="ses-pics">' + figs + '</ul>' +
        '</div></li>');
    });
    if (!rows.length) return '';
    return '<ol class="ses-folders" id="sesiones-indice">' + rows.join('') + '</ol>';
  }
  function sesSetOpen(row, open) {
    if (!row.querySelector('[data-ses-plus]')) return; // sesiones siempre minimizadas
    row.classList.toggle('is-open', open);
    var b = row.querySelector('[data-ses-plus]');
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.querySelector('.ses-plus-g').textContent = open ? '−' : '+';
    sesVideoSync(row);
    sesAnimate(row);
  }
  // Con #sesion-<slug> en la URL: expande esa fila y baja hasta ella
  function sesFromHash(root) {
    var id = decodeURIComponent((location.hash || '').slice(1));
    if (!id || id.indexOf('sesion-') !== 0) return;
    var row = null;
    Array.prototype.forEach.call(root.querySelectorAll('.ses-row'), function (r) { if (r.id === id) row = r; });
    if (!row) return;
    sesSetOpen(row, true);
    row.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  function sesAnimate(row) {
    if (!motionOK()) return;
    var m = row.querySelector('.ses-main');
    m.classList.remove('is-anim');
    void m.offsetWidth;
    m.classList.add('is-anim');
  }
  function seriesGallery(p, id) {
    var count = (p.series || []).reduce(function (a, s) { return a + serieFotos(s).length; }, 0);
    var vids = (p.videos || []).map(function (v, i) {
      return { forceFull: true, html: function () { return videoBlock(v, p.nombre + ', video ' + (i + 1)); } };
    });
    count += vids.length;
    if (!count) return '';
    return '<section class="gal" aria-labelledby="' + id + '">' +
      '<div class="gal-label mono"><h2 id="' + id + '">Sesiones — ' + plural(count, 'pieza', 'piezas') + '</h2><span aria-hidden="true">[ ↓ ]</span></div>' +
      seriesCovers(p) + seriesFolders(p) +
      (vids.length ? '<div data-rv>' + galleryRows(vids) + '</div>' : '') + '</section>';
  }
  /* ---------- diseño agrupado (manual, menú, carruseles) ---------- */
  var reduceMq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function motionOK() { return !(reduceMq && reduceMq.matches); }
  function isDisenoSeries(d) {
    return Array.isArray(d) && d.some(function (s) { return s && typeof s === 'object' && Array.isArray(s.fotos); });
  }
  function capText(f, i) {
    return '(' + pad(i + 1) + ')' + (f.caption ? ' ' + String(f.caption).toLocaleUpperCase('es') : '');
  }
  function unidad(layout, n) {
    var u = layout === 'manual' ? ['página', 'páginas'] : layout === 'carrusel' ? ['lámina', 'láminas'] : ['pieza', 'piezas'];
    return plural(n, u[0], u[1]);
  }
  // Manual: primera página a ancho completo, el resto en pares 6+6 (la impar final queda a la izquierda)
  function manualRows(fotos, cell) {
    var out = '';
    var row = function (cls, cells) { return '<div class="gal-row gal-row--ed ' + cls + '">' + cells.join('') + '</div>'; };
    out += row('man-1', [cell(fotos[0], 0, 'g1')]);
    for (var k = 1; k < fotos.length; k += 2) {
      out += k + 1 < fotos.length
        ? row('man-2', [cell(fotos[k], k, 'g1'), cell(fotos[k + 1], k + 1, 'g2')])
        : row('man-h', [cell(fotos[k], k, 'g1')]);
    }
    return out;
  }
  function carouselSlide(p, titulo, grp, f, i) {
    var w = Number(f.w), h = Number(f.h), dims = isFinite(w) && isFinite(h) && w > 0 && h > 0;
    var ar = dims ? ' data-ar="' + w + '/' + h + '"' : '';
    var cap = '<figcaption class="mono">' + esc(capText(f, i)) + '</figcaption>';
    var media;
    if (f.video) {
      var label = p.nombre + ' — ' + titulo + ', video ' + (i + 1) + ' (sin audio)';
      media = '<div class="car-vid"' + ar + '><video muted loop playsinline preload="none" src="' + esc(asset(f.src)) + '"' +
        (f.poster ? ' poster="' + esc(asset(f.poster)) + '"' : '') + (dims ? ' width="' + w + '" height="' + h + '"' : '') +
        ' aria-label="' + esc(label) + '"></video>' +
        '<button type="button" class="car-play mono" aria-label="' + esc('Reproducir video: ' + label) + '">▶ Reproducir</button></div>';
    } else {
      media = photoBtn('ph-ed', f, p.nombre + ' — ' + titulo + ', lámina ' + (i + 1), grp, titulo, true);
    }
    return '<li class="car-slide"><figure>' + media + cap + '</figure></li>';
  }
  function disenoSerieBlock(p, serie, num, grp, hid, cid) {
    var fotos = (serie.fotos || []).filter(function (f) { return f && f.src; });
    if (!fotos.length) return '';
    var titulo = serie.titulo || ('Serie ' + pad(num));
    var layout = serie.layout;
    var headTxt = '<h3 id="' + hid + '">[ ' + pad(num) + ' ] ' + esc(titulo) + ' — ' + unidad(layout, fotos.length) + '</h3>';
    var cell = function (f, i, g) {
      var alt = p.nombre + ' — ' + titulo + ', ' + (f.caption ? f.caption : 'foto ' + (i + 1));
      return '<figure class="' + g + '">' + photoBtn('ph-ed', f, alt, grp, titulo, true) +
        '<figcaption class="mono">' + esc(capText(f, i)) + '</figcaption></figure>';
    };
    if (layout === 'carrusel') {
      return '<div class="serie serie--car" data-rv data-car><div class="serie-head serie-head--car mono">' + headTxt +
        '<div class="car-ctl"><span class="car-count" aria-live="polite"></span>' +
        '<button type="button" class="car-btn car-prev" aria-controls="' + cid + '" aria-label="Lámina anterior" disabled><span aria-hidden="true">←</span></button>' +
        '<button type="button" class="car-btn car-next" aria-controls="' + cid + '" aria-label="Lámina siguiente"><span aria-hidden="true">→</span></button></div></div>' +
        '<div class="car" id="' + cid + '" role="region" aria-label="' + esc(titulo) + '" tabindex="0"><ul class="car-track">' +
        fotos.map(function (f, i) { return carouselSlide(p, titulo, grp, f, i); }).join('') + '</ul></div></div>';
    }
    return '<div class="serie" data-rv><div class="serie-head mono">' + headTxt + '</div>' +
      (layout === 'manual' ? manualRows(fotos, cell) : editorialRows(fotos, cell)) + '</div>';
  }
  function disenoGroups(p) {
    var groups = [];
    p.diseno.forEach(function (s) {
      if (!s || !Array.isArray(s.fotos)) return;
      var name = s.grupo || 'Diseño';
      var g = null;
      groups.forEach(function (x) { if (x.name === name) g = x; });
      if (!g) { g = { name: name, series: [] }; groups.push(g); }
      g.series.push(s);
    });
    return groups.map(function (g, gi) {
      var count = 0;
      var inner = '';
      var num = 0;
      g.series.forEach(function (s, si) {
        var n = s.fotos.filter(function (f) { return f && f.src; }).length;
        if (!n) return;
        count += n;
        num += 1;
        inner += disenoSerieBlock(p, s, num, 'dis-' + gi + '-' + si, 'dis-h-' + gi + '-' + si, 'car-' + gi + '-' + si);
      });
      if (!count) return '';
      var id = 'g-diseno-' + gi;
      return '<section class="gal" aria-labelledby="' + id + '">' +
        '<div class="gal-label mono"><h2 id="' + id + '">' + esc(g.name) + ' — ' + plural(count, 'pieza', 'piezas') + '</h2><span aria-hidden="true">[ ↓ ]</span></div>' +
        inner + '</section>';
    }).join('');
  }

  /* carruseles: botones, contador, arrastre con mouse y videos */
  function initCarousels(scope) {
    var wraps = scope.querySelectorAll('[data-car]');
    if (!wraps.length) return;
    Array.prototype.forEach.call(wraps, function (wrap) {
      var car = wrap.querySelector('.car');
      var slides = Array.prototype.slice.call(car.querySelectorAll('.car-slide'));
      var prevB = wrap.querySelector('.car-prev');
      var nextB = wrap.querySelector('.car-next');
      var countEl = wrap.querySelector('.car-count');
      var raf = 0;
      var drag = null;
      var moved = false;
      var smooth = function () { return motionOK() ? 'smooth' : 'auto'; };
      var step = function () {
        return slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : (slides[0] ? slides[0].offsetWidth : 1) || 1;
      };
      var maxScroll = function () { return Math.max(0, car.scrollWidth - car.clientWidth); };
      var setDisabled = function (b, d) {
        if (b.disabled === d) return;
        if (d && doc.activeElement === b) {
          var other = b === prevB ? nextB : prevB;
          if (!other.disabled) other.focus({ preventScroll: true }); else car.focus({ preventScroll: true });
        }
        b.disabled = d;
      };
      var update = function () {
        raf = 0;
        var sl = car.scrollLeft, mx = maxScroll(), st = step(), n = slides.length;
        var first = Math.min(n - 1, Math.max(0, Math.round(sl / st)));
        var last = first;
        slides.forEach(function (s, i) {
          if (s.offsetLeft + s.offsetWidth - sl <= car.clientWidth + 2) last = Math.max(last, i);
        });
        if (mx - sl <= 2) last = n - 1;
        countEl.textContent = (first === last ? pad(first + 1) : pad(first + 1) + '–' + pad(last + 1)) + ' / ' + pad(n);
        setDisabled(prevB, sl <= 2);
        setDisabled(nextB, mx - sl <= 2);
      };
      var schedule = function () { if (!raf) raf = window.requestAnimationFrame(update); };
      var go = function (dir) {
        var st = step();
        var i = Math.round(car.scrollLeft / st);
        car.scrollTo({ left: Math.max(0, Math.min(maxScroll(), (i + dir) * st)), behavior: smooth() });
      };
      prevB.addEventListener('click', function () { go(-1); });
      nextB.addEventListener('click', function () { go(1); });
      car.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      if (typeof window.ResizeObserver === 'function') new window.ResizeObserver(schedule).observe(car);

      // arrastre con mouse (táctil y teclado usan el scroll nativo)
      car.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        drag = { x: e.clientX, sl: car.scrollLeft, id: e.pointerId };
        moved = false;
      });
      car.addEventListener('pointermove', function (e) {
        if (!drag) return;
        if (e.buttons !== 1) { endDrag(); return; }
        var dx = e.clientX - drag.x;
        if (!moved && Math.abs(dx) > 5) {
          moved = true;
          car.classList.add('is-drag');
          try { car.setPointerCapture(drag.id); } catch (err) { /* sin captura */ }
        }
        if (moved) car.scrollLeft = drag.sl - dx;
      });
      var endDrag = function () {
        if (!drag) return;
        var was = moved;
        drag = null;
        if (!was) return;
        car.classList.remove('is-drag');
        var st = step();
        car.scrollTo({ left: Math.min(maxScroll(), Math.round(car.scrollLeft / st) * st), behavior: smooth() });
        window.setTimeout(function () { moved = false; }, 0);
      };
      car.addEventListener('pointerup', endDrag);
      car.addEventListener('pointercancel', endDrag);
      car.addEventListener('pointerleave', endDrag);
      car.addEventListener('lostpointercapture', endDrag);
      car.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
      car.addEventListener('dragstart', function (e) { e.preventDefault(); });

      update();
    });

    // videos: autoplay solo con >= 60% visible; con movimiento reducido, botón manual
    var vids = Array.prototype.slice.call(scope.querySelectorAll('.car-vid video'));
    if (!vids.length) return;
    var io = null;
    var paintBtn = function (v) {
      var btn = v.parentNode.querySelector('.car-play');
      var label = v.getAttribute('aria-label');
      btn.textContent = v.paused ? '▶ Reproducir' : '❚❚ Pausar';
      btn.setAttribute('aria-label', (v.paused ? 'Reproducir video: ' : 'Pausar video: ') + label);
    };
    vids.forEach(function (v) {
      v.muted = true;
      var btn = v.parentNode.querySelector('.car-play');
      btn.addEventListener('click', function () {
        if (v.paused) {
          delete v.dataset.userPaused;
          var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
        } else {
          v.dataset.userPaused = '1';
          v.pause();
        }
      });
      v.addEventListener('play', function () { paintBtn(v); });
      v.addEventListener('pause', function () { paintBtn(v); });
    });
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.intersectionRatio >= 0.6) {
            if (motionOK() && !v.dataset.userPaused) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          } else if (!v.paused) {
            v.pause();
          }
        });
      }, { threshold: [0, 0.6] });
      vids.forEach(function (v) { io.observe(v); });
    }
    // el botón Reproducir/Pausar siempre visible (WCAG 2.2.2)
    var motionSync = function () {
      vids.forEach(function (v) {
        if (!motionOK() && !v.paused) v.pause();
        if (io) { io.unobserve(v); io.observe(v); }
      });
    };
    motionSync();
    if (reduceMq) {
      if (reduceMq.addEventListener) reduceMq.addEventListener('change', motionSync);
      else if (reduceMq.addListener) reduceMq.addListener(motionSync);
    }
  }

  function applyAspect(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('[data-ar]'), function (el) {
      el.style.aspectRatio = el.getAttribute('data-ar');
    });
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

      var disenoSeries = isDisenoSeries(p.diseno);
      var diseno = disenoSeries ? [] : (p.diseno || []).map(function (d, i) {
        d = typeof d === 'string' ? d : (d && d.src) || '';
        return { html: function (r) {
          if (!d) return imageBlock(d, r, p.nombre + ', diseño ' + (i + 1), 'Imagen pendiente');
          var alt = p.nombre + ' — Diseño, imagen ' + (i + 1);
          return '<button type="button" class="frame lb-open ' + r + '" data-lb="diseno" data-lb-title="Diseño" aria-label="' +
            esc('Ampliar: ' + alt) + '"><img src="' + esc(asset(d)) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async"></button>';
        } };
      });
      var hasSeries = Array.isArray(p.series) && p.series.length > 0;
      var sesiones = (p.fotos || []).map(function (f, i) {
        return { html: function (r) { return imageBlock(f, r, p.nombre + ', foto ' + (i + 1), 'Imagen pendiente'); } };
      }).concat((p.videos || []).map(function (v, i) {
        return { forceFull: true, html: function () { return videoBlock(v, p.nombre + ', video ' + (i + 1)); } };
      }));

      var navLink = function (q, dir) {
        return '<a href="' + esc(pageUrl(q.slug)) + '"><span class="mono">' + (dir === 'prev' ? '← Anterior' : 'Siguiente →') +
          '</span><span class="nm">' + esc(q.nombre) + '</span></a>';
      };

      var rest = (disenoSeries ? disenoGroups(p) : gallery('Diseño', diseno, 'g-diseno')) +
        (hasSeries ? seriesGallery(p, 'g-sesiones') : gallery('Sesiones', sesiones, 'g-sesiones')) +
        (total > 1
          ? '<nav class="fx-next" aria-label="Más proyectos" data-rv>' + navLink(prev, 'prev') + navLink(next, 'next') + '</nav>'
          : '');
      // "Ver sesiones ↓": ancla a Sesiones o, si no hay, a la primera sección de la ficha
      var destino = rest.indexOf('id="g-sesiones"') !== -1 ? 'g-sesiones'
        : rest.indexOf('id="g-diseno-0"') !== -1 ? 'g-diseno-0'
        : rest.indexOf('id="g-diseno"') !== -1 ? 'g-diseno' : '';
      var verTxt = destino === 'g-sesiones' ? 'Ver sesiones' : 'Ver trabajo';
      var minis = projThumbs(p, 3, true);
      var minisHTML = minis.length
        ? '<div class="fx-thumbs" aria-hidden="true">' + minis.map(function (t) {
          return '<div class="fx-th"><img src="' + esc(asset(t.src)) + '" alt=""' + (t.w ? ' width="' + t.w + '" height="' + t.h + '"' : '') + ' loading="lazy" decoding="async"></div>';
        }).join('') + '</div>'
        : '';

      root.innerHTML =
        '<section class="grid fx-top" data-rv>' +
          '<div class="fx-cover">' + imageBlock(p.portada, 'r45', p.nombre + ', portada', 'Portada pendiente', { eager: true, size: p.portadaSize }) + '</div>' +
          '<div class="fx-side">' +
            '<div class="fx-head">' +
              '<div class="fx-bar mono"><span><span aria-hidden="true">→</span> Proyecto ' + pad(idx + 1) + ' / ' + pad(total) + '</span>' +
                '<a href="' + esc(base + 'proyectos.html') + '"><span aria-hidden="true">←</span> Proyectos</a></div>' +
              '<p class="fx-num" aria-hidden="true">' + pad(idx + 1) + '</p>' +
              '<h1 class="fx-title">' + esc(p.nombre) + '</h1>' +
            '</div>' +
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
            (destino ? '<p class="fx-link mono"><a href="#' + destino + '">' + verTxt + ' <span aria-hidden="true">↓</span></a></p>' : '') +
            minisHTML +
          '</div>' +
        '</section>' + rest;
      applyAspect(root);
      initCarousels(root);
      initSesVideos(root);
      sesFromHash(root);
      toTop();
    }
  }

  /* ---------- visor de imágenes (lightbox) ---------- */
  var lb = null;
  var lbState = { items: [], i: 0, opener: null };
  function buildLightbox() {
    var el = doc.createElement('div');
    el.className = 'lb';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Visor de imágenes');
    el.hidden = true;
    el.innerHTML =
      '<div class="lb-bar mono"><p class="lb-info" aria-live="polite"><span class="lb-count"></span> <span class="lb-title"></span></p>' +
      '<button type="button" class="lb-close">Cerrar <span aria-hidden="true">✕</span></button></div>' +
      '<div class="lb-stage"><img class="lb-img" alt=""><video class="lb-vid" controls playsinline muted loop preload="metadata" hidden></video></div>' +
      '<button type="button" class="lb-nav lb-prev" aria-label="Foto anterior"><span aria-hidden="true">←</span></button>' +
      '<button type="button" class="lb-nav lb-next" aria-label="Foto siguiente"><span aria-hidden="true">→</span></button>';
    body.appendChild(el);
    var x0 = null;
    el.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('.lb-close') || t.classList.contains('lb-stage') || t === el) lbClose();
      else if (t.closest('.lb-prev')) lbGo(-1);
      else if (t.closest('.lb-next')) lbGo(1);
    });
    el.addEventListener('touchstart', function (e) { x0 = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (x0 === null || !e.changedTouches.length) return;
      var dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) lbGo(dx < 0 ? 1 : -1);
    }, { passive: true });
    return el;
  }
  function lbShow() {
    var it = lbState.items[lbState.i];
    var img = lb.querySelector('.lb-img');
    var vid = lb.querySelector('.lb-vid');
    vid.pause();
    vid.removeAttribute('src');
    vid.removeAttribute('poster');
    if (it.video) {
      img.hidden = true;
      vid.hidden = false;
      vid.muted = true;
      vid.poster = it.src;
      vid.src = it.video;
      vid.setAttribute('aria-label', it.alt + ' (video)');
      if (it.w && it.h) { vid.setAttribute('width', it.w); vid.setAttribute('height', it.h); }
      if (motionOK()) { var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); }
    } else {
      vid.hidden = true;
      img.hidden = false;
      img.src = it.src;
      img.alt = it.alt;
    }
    lb.querySelector('.lb-count').textContent = pad(lbState.i + 1) + ' / ' + pad(lbState.items.length);
    lb.querySelector('.lb-title').textContent = it.title ? '— ' + it.title : '';
    var multi = lbState.items.length > 1;
    lb.querySelector('.lb-prev').hidden = !multi;
    lb.querySelector('.lb-next').hidden = !multi;
    if (multi) { // precarga vecinas
      [1, -1].forEach(function (d) {
        var n = lbState.items[(lbState.i + d + lbState.items.length) % lbState.items.length];
        var pre = new Image();
        pre.src = n.src; // póster si es video
      });
    }
  }
  function lbGo(d) {
    var n = lbState.items.length;
    if (n < 2) return;
    lbState.i = (lbState.i + d + n) % n;
    lbShow();
  }
  function lbOpen(btn) {
    var grp = btn.getAttribute('data-lb');
    var all = Array.prototype.slice.call(doc.querySelectorAll('.lb-open[data-lb="' + grp + '"]'));
    var btns = all;
    lbState.items = btns.map(function (b) {
      var im = b.querySelector('img');
      return { src: im.getAttribute('src'), video: b.getAttribute('data-lb-video') || '', w: im.getAttribute('width'), h: im.getAttribute('height'),
        alt: im.getAttribute('alt') || '', title: b.getAttribute('data-lb-title') || '', btn: b };
    });
    var start = btns.indexOf(btn);
    lbState.i = Math.max(0, start);
    lbState.opener = btn;
    if (!lb) lb = buildLightbox();
    lb.hidden = false;
    body.classList.add('lb-lock');
    Array.prototype.forEach.call(body.children, function (el) { if (el !== lb) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); } });
    lbShow();
    lb.querySelector('.lb-close').focus();
  }
  function lbClose() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    lb.querySelector('.lb-img').removeAttribute('src');
    var lv = lb.querySelector('.lb-vid');
    lv.pause();
    lv.removeAttribute('src');
    lv.removeAttribute('poster');
    body.classList.remove('lb-lock');
    Array.prototype.forEach.call(body.children, function (el) { if (el !== lb) { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); } });
    var back = lbState.opener;
    if (back && back.focus) back.focus();
  }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.lb-open') : null;
    if (b) lbOpen(b);
  });
  doc.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-ses-link]') : null;
    if (!a) return;
    var t = doc.getElementById((a.getAttribute('href') || '').slice(1));
    if (!t) return;
    e.preventDefault();
    if (t.classList.contains('ses-row')) sesSetOpen(t, true);
    t.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block: 'start' });
    if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'));
    var h = t.querySelector('.ses-name');
    if (h) h.focus({ preventScroll: true });
  });
  doc.addEventListener('click', function (e) {
    var tg = e.target.closest ? e.target.closest('[data-ses-plus]') : null;
    if (!tg) return;
    var row = tg.closest('.ses-row');
    if (!row) return;
    sesSetOpen(row, !row.classList.contains('is-open'));
  });
  doc.addEventListener('keydown', function (e) {
    if (!lb || lb.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); lbClose(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); lbGo(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); lbGo(1); }
    else if (e.key === 'Tab') { // foco atrapado
      var f = Array.prototype.filter.call(lb.querySelectorAll('button'), function (x) { return !x.hidden; });
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (!lb.contains(doc.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

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

  /* ---------- reloj y fecha de Santiago ---------- */
  var reloj = doc.getElementById('reloj');
  var relojes = doc.querySelectorAll('[data-reloj]');
  var fechaEl = doc.getElementById('fecha');
  if (reloj || fechaEl || relojes.length) {
    var fmt = null;
    var fmtF = null;
    try {
      fmt = new Intl.DateTimeFormat('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
      fmtF = new Intl.DateTimeFormat('es-CL', { timeZone: 'America/Santiago', day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (err) { fmt = null; fmtF = null; }
    var tick = function () {
      var now = new Date();
      if (reloj && fmt) reloj.textContent = 'SCL ' + fmt.format(now).replace(/\s/g, '');
      if (fmt) Array.prototype.forEach.call(relojes, function (el) { el.textContent = 'Santiago ' + fmt.format(now).replace(/\s/g, ''); });
      if (fechaEl && fmtF) fechaEl.textContent = fmtF.format(now).replace(/\s/g, '').replace(/[-.]/g, '/');
    };
    tick();
    window.setInterval(tick, 30000);
  }

  /* ---------- inicio: cinta que corre sobre el ítem del menú ---------- */
  Array.prototype.forEach.call(doc.querySelectorAll('.hm-item > a[data-tape]'), function (a) {
    var txt = a.getAttribute('data-tape');
    var tape = doc.createElement('span');
    var track = doc.createElement('span');
    tape.className = 'hm-tape';
    tape.setAttribute('aria-hidden', 'true');
    track.className = 'hm-track';
    for (var c = 0; c < 2; c++) {
      var set = doc.createElement('span');
      set.className = 'hm-set';
      for (var n = 0; n < 12; n++) {
        var s = doc.createElement('span');
        s.textContent = txt;
        set.appendChild(s);
      }
      track.appendChild(set);
    }
    tape.appendChild(track);
    a.parentNode.appendChild(tape);
  });

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
   * Envía por Web3Forms (https://web3forms.com) a contacto@montanadept.com.
   * La access key es pública por diseño (va en el front). Si está vacía o el
   * envío falla, se muestra el respaldo: enlace mailto + copiar mensaje.
   */
  var WEB3FORMS_KEY = '226cccf3-619f-4bb7-9870-dc3758a8f76b';
  var form = doc.querySelector('form[data-form]');
  if (form) {
    var ready = doc.getElementById('form-ready');
    var readyTitle = doc.getElementById('form-ready-title');
    var readyActions = doc.getElementById('form-ready-actions');
    var mailLink = doc.getElementById('form-mailto');
    var copyBtn = doc.getElementById('form-copy');
    var sendBtn = form.querySelector('button[type="submit"]');
    var mailBody = '';
    var copyTimer = null;
    var sending = false;
    var val = function (name) {
      var el = form.elements[name];
      return el ? String(el.value || '').trim() : '';
    };
    var showReady = function (title, withFallback) {
      if (readyTitle) readyTitle.textContent = title;
      if (readyActions) readyActions.hidden = !withFallback;
      if (ready) {
        ready.hidden = false;
        if (ready.scrollIntoView) ready.scrollIntoView({ block: 'nearest' });
      }
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
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

      if (!WEB3FORMS_KEY || !window.fetch) { showReady('Tu mensaje está listo.', true); return; }

      var data = new FormData(form);
      data.append('access_key', WEB3FORMS_KEY);
      data.append('subject', subject);
      data.append('from_name', 'Web Montaña Dept');
      data.append('replyto', val('correo'));
      sending = true;
      if (sendBtn) { sendBtn.disabled = true; sendBtn.firstChild.nodeValue = 'Enviando '; }
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().then(function (j) { return r.ok && j && j.success; }); })
        .catch(function () { return false; })
        .then(function (ok) {
          sending = false;
          if (sendBtn) { sendBtn.disabled = false; sendBtn.firstChild.nodeValue = 'Enviar '; }
          if (ok) {
            form.reset();
            showReady('Mensaje enviado. Te respondemos pronto.', false);
          } else {
            showReady('No se pudo enviar. Mándalo desde tu correo:', true);
          }
        });
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
