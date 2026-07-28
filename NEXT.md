# Next

## Pendiente de UI
- [ ] **Navbar PC apretada** — El header en desktop tiene los elementos demasiado juntos (nav links + utility block). Revisar spacing/gap entre elementos y si el `header-inner` necesita más padding o si los nav-links tienen que reducir `gap`/`font-size`. Comprobar entre ~1100px y 1440px donde más se nota el apretamiento.

## Pendiente de contenido
- [ ] **Arreglar tarifas** — Confirmar si los precios actuales (40€/mes, 35€ estudiantes/jubilados, bonos 25€/35€, trimestre 100€, chip 5€) son correctos o hay nuevos precios. Actualizar en: `servicios/index.html` (price-catalog + JSON-LD), `en/services/index.html`, `index.html` (pricing-panel check-list), `arroyo/index.html`, `en/arroyo/index.html`, `en/free-weights/index.html` (FAQ).
- [ ] **Foto "Máquinas y poleas"** — La facility-card de máquinas en `index.html` muestra el placeholder CSS "FOTO" en lugar de una imagen real. Las otras 3 (peso libre, cardio, sala de actividades) ya tienen foto.

## Pendiente de assets
- [ ] **OG image actividades-dirigidas** — `actividades-dirigidas/index.html` y `en/classes/index.html` declaran la foto cruda a 4032×3024 como imagen OG. Crear un recorte de 1200×630 optimizado y actualizar `og:image:width`/`og:image:height`.

## Auditoría — fixes aplicados en sesión anterior
- [x] `var(--muted)` indefinida → corregida a `var(--muted-light)` en `.machine-section-heading p`
- [x] `var(--font-display)` indefinida → corregida a `var(--display)` (×2) en activity-poster-head y activity-table
- [x] Minibar texto invisible (blanco sobre blanco) → añadido `color: var(--ink)` a `.minibar-sheet-panel` y `.minibar-preview`
- [x] Contraste footer insuficiente → subido opacidad de `.studio-credit` (0.42→0.62) y `.footer-links a` (0.5→0.68)
- [x] Tabla actividades sin `scope="col"` → añadido a los 6 `<th>` en ES y EN
- [x] Sitemap legal pages sin `x-default` → añadido a `/legal/` y `/en/legal/`
- [x] Imagen `peso libre-fuengirola.png` con espacio en nombre → renombrada a `peso-libre-fuengirola.png` y referencia actualizada en `index.html`
- [x] Tarjetas de precio con texto largo en h3 (wrapping) → restructuradas para mostrar solo el precio en h3 y mover modificadores al kicker
- [x] Teléfono en header desktop se partía en varias líneas → añadido `white-space: nowrap` a `.header-call`
