# SEO y compartir novedades

## Implementado en la SPA

La ruta `/feed/:postId` actualiza al cargar la publicación:

- `title` y `description`.
- `canonical` con la URL permanente del artículo.
- Open Graph: `og:type=article`, título, descripción, URL, imagen, categoría y fechas.
- Twitter Cards `summary_large_image`.
- JSON-LD `Article` con autor, publisher, imagen, fechas y `mainEntityOfPage`.
- Acción **Compartir** con Web Share API y fallback de copiar enlace.
- Enlaces directos para WhatsApp, LinkedIn y X.

La portada opcional se selecciona desde el editor y se guarda en el bucket público `feed-covers` de Supabase. La URL pública resultante se persiste en `app_feed_posts.image_url`, por lo que el detalle, Open Graph y Twitter Cards reutilizan la misma imagen. Para una tarjeta consistente se recomienda una imagen de 1200×630 px; si no existe, se utiliza `/og-image.png`. La migración `20261004020000_feed_covers_storage.sql` crea el bucket, limita el tamaño a 5 MB y restringe la escritura a superadministradores.

## Límite de una SPA estática

La aplicación se entrega con Vite y el fallback de Apache sirve `index.html` para `/feed/:postId`. Los navegadores ejecutan React y reciben los metadatos dinámicos, pero algunos crawlers de redes sociales leen únicamente el HTML inicial y no ejecutan JavaScript. En ese caso mostrarán la tarjeta genérica de SOPHENA.

El botón de compartir usa ahora `https://<project-ref>.supabase.co/functions/v1/share-feed?post=<id>` cuando Supabase está configurado. La Edge Function `supabase/functions/share-feed/index.ts` consulta únicamente publicaciones públicas (`audience_type = 'all'`) ya publicadas, genera el HTML con los metadatos de la portada y deja que el navegador continúe hacia `/feed/:postId`. Esto permite que los crawlers obtengan la imagen antes de que React cargue.

Para obtener una tarjeta única por artículo en producción, el hosting debe renderizar o inyectar metadatos para `/feed/:postId` antes de entregar la SPA. La respuesta para crawlers debe consultar únicamente publicaciones públicas y emitir:

1. `og:title`, `og:description`, `og:url`, `og:image` y `og:type=article`.
2. `article:published_time`, `article:modified_time` y `article:section`.
3. Twitter Cards equivalentes.
4. Un enlace canónico y una redirección/hidratación hacia la SPA para personas reales.

No uses una service key de Supabase en el navegador ni en archivos públicos. La función usa `SUPABASE_SERVICE_ROLE_KEY` únicamente en el entorno seguro de Supabase Edge Functions y no expone publicaciones segmentadas por roles o usuarios.
