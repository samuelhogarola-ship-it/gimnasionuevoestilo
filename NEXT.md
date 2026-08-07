# Next

## Plan SEO vendible — 5-6 horas

Objetivo: reforzar la identidad de Nuevo Estilo en Google para clientes locales, turistas y expats, trabajando la web en español e inglés y consolidando la presencia en directorios.

### 1. SEO en la web bilingüe y visibilidad en buscadores IA — 3-4 horas

- [ ] Revisar y optimizar titles, meta descriptions y H1 de las páginas principales en español e inglés.
- [ ] Reforzar la arquitectura de enlaces entre home, servicios, precios, peso libre, máquinas, clases, contacto y Paco Mula.
- [ ] Revisar la landing inglesa de visitantes y valorar su equivalente española.
- [ ] Revisar el marcado `canonical`, `hreflang`, `BreadcrumbList`, `FAQPage`, `HealthClub`, `Service` y `Person`.
- [ ] Revisar la indexación de imágenes: nombres descriptivos, textos `alt`, sitemap de imágenes y contexto visible junto a cada fotografía.
- [ ] Revisar imágenes principales para Google Images: peso, formato, dimensiones, `loading`, `srcset` y textos alternativos.
- [ ] Validar enlaces internos, sitemap, robots.txt y ausencia de errores HTML.
- [ ] Entregar una comprobación final en móvil y escritorio.

#### Preparación para ChatGPT, Gemini, Perplexity y Google AI Overviews

La web debe responder claramente a las preguntas que una IA recibe cuando alguien busca un gimnasio en Fuengirola. El objetivo es que Nuevo Estilo pueda aparecer como recomendación verificable, no solo como una página que contiene keywords.

- [ ] Crear un bloque visible de respuesta directa: quién es Nuevo Estilo, dónde está, para quién es, qué instalaciones tiene y qué opciones de acceso ofrece.
- [ ] Reforzar las entidades relacionadas: Nuevo Estilo Gym, Fuengirola, Paco Mula, bodybuilding, fuerza, peso libre, máquinas y day pass.
- [ ] Mantener el mismo nombre, dirección, teléfono, horarios, categoría y web en la web y en los tres directorios.
- [ ] Añadir preguntas y respuestas naturales para consultas como “What is the best gym in Fuengirola?”, “Where can I train for one day in Fuengirola?” y “Which gym in Fuengirola has free weights?”.
- [ ] Reforzar `HealthClub`, `Service`, `Person`, `FAQPage`, `BreadcrumbList` y `ImageObject` con relaciones coherentes entre el gimnasio y Paco Mula.
- [ ] Crear una sección “About Nuevo Estilo” con hechos verificables, experiencia de Paco Mula, instalaciones, ubicación y opciones para visitantes.
- [ ] Revisar que la información importante esté en HTML visible y no dependa solo de JavaScript, imágenes o archivos PDF.
- [ ] Preparar una ficha factual breve para usar como base en directorios, menciones externas y futuras respuestas de IA.
- [ ] Medir manualmente consultas de referencia en ChatGPT, Gemini, Perplexity y Google después de publicar los cambios; no prometer una posición concreta, porque las respuestas de IA varían según ubicación, usuario y fuentes disponibles.

### 2. Directorios y perfiles locales — 2 horas

- [ ] Revisar y actualizar los tres directorios ya existentes con el mismo NAP: nombre, dirección, teléfono y web.
- [ ] Crear o reclamar la ficha de Tripadvisor, evitando duplicados.
- [ ] Revisar y actualizar la ficha existente en Bing Places.
- [ ] Revisar o crear la ubicación en Apple Business Connect / Apple Maps.
- [ ] Subir fotografías reales y actuales: fachada, recepción, peso libre, máquinas, cardio, spinning y sala de actividades.
- [ ] Comprobar que teléfono, dirección, horarios, categoría y enlace web coincidan en todas las fichas.

#### Datos comunes para todos los perfiles

- Business name: Nuevo Estilo Gym Fuengirola
- Address: Avd. Jesus Santos Rein, Edif. Vega, Bajo, 29640 Fuengirola, Malaga, Spain
- Phone: +34 952 47 00 44
- Website: https://gimnasionuevoestilo.com/en/best-gym-fuengirola/
- Category: Gym

#### Descripción para Bing Places

Nuevo Estilo Gym is a serious strength-training gym in central Fuengirola. It offers free weights, benches, bars, strength machines, cardio, instructor-led classes and short-stay options including day passes. Suitable for visitors, expats and local members. Led by Paco Mula, bodybuilding competitor and coach.

#### Comprobaciones específicas de Bing Places

- [ ] Confirmar que no exista una ficha duplicada.
- [ ] Confirmar que el mapa marque la dirección correcta.
- [ ] Confirmar que los horarios coincidan con la web.
- [ ] Confirmar que el teléfono tenga formato internacional.
- [ ] Confirmar que la web enlace a la landing inglesa.
- [ ] Confirmar que las imágenes sean reales y actuales.

#### Comprobaciones específicas de Tripadvisor y Apple

- [ ] Buscar primero una ficha existente y reclamarla antes de crear una nueva.
- [ ] Mantener el nombre comercial real, sin añadir keywords como “Best Gym”.
- [ ] Usar la misma dirección, teléfono, horarios, categoría y web.
- [ ] Subir fotografías propias, actuales y sin duplicados.
- [ ] Comprobar que el pin del mapa y el enlace de llamada funcionan correctamente.

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
