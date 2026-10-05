import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const siteUrl = (Deno.env.get('APP_URL') || 'https://sophena.online').replace(/\/$/, '');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function plainText(value: unknown) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function publicImageUrl(value: unknown) {
  try {
    const url = new URL(String(value || ''));
    return ['http:', 'https:'].includes(url.protocol) ? url.href : `${siteUrl}/og-image.png`;
  } catch {
    return `${siteUrl}/og-image.png`;
  }
}

function imageMimeType(value: string) {
  const pathname = new URL(value).pathname.toLowerCase();
  if (pathname.endsWith('.png')) return 'image/png';
  if (pathname.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

function articleHtml(post: Record<string, unknown>) {
  const postTitle = plainText(post.title) || 'Novedad';
  const title = `${postTitle} — SOPHENA`;
  const description = (plainText(post.excerpt || post.content) || 'Una nueva novedad de SOPHENA.').slice(0, 170);
  const postId = encodeURIComponent(String(post.id));
  const canonicalUrl = `${siteUrl}/feed/${postId}`;
  const imageUrl = publicImageUrl(post.image_url);
  const imageType = imageMimeType(imageUrl);
  const category = plainText(post.category) || 'Novedad';
  const publishedAt = String(post.published_at || post.created_at || new Date().toISOString());
  const modifiedAt = String(post.updated_at || publishedAt);
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: postTitle,
    description,
    url: canonicalUrl,
    image: [imageUrl],
    datePublished: publishedAt,
    dateModified: modifiedAt,
    articleSection: category,
    author: { '@type': 'Organization', name: 'SOPHENA', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'SOPHENA', url: siteUrl, logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.svg` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  }).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    <meta property="og:site_name" content="SOPHENA">
    <meta property="og:locale" content="es_CO">
    <meta property="og:image" content="${escapeHtml(imageUrl)}">
    <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
    <meta property="og:image:type" content="${imageType}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${escapeHtml(postTitle)}">
    <meta property="article:section" content="${escapeHtml(category)}">
    <meta property="article:published_time" content="${escapeHtml(publishedAt)}">
    <meta property="article:modified_time" content="${escapeHtml(modifiedAt)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
    <meta name="twitter:image:alt" content="${escapeHtml(postTitle)}">
    <script type="application/ld+json">${jsonLd}</script>
    <script>window.location.replace(${JSON.stringify(canonicalUrl)});</script>
  </head>
  <body>
    <p>Abriendo la novedad… <a href="${escapeHtml(canonicalUrl)}">Continuar en SOPHENA</a></p>
  </body>
</html>`;
}

function notFound() {
  return new Response('<!doctype html><title>Novedad no disponible — SOPHENA</title><meta name="robots" content="noindex">', {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

Deno.serve(async request => {
  if (!supabaseUrl || !serviceRoleKey) return new Response('Share resolver no configurado.', { status: 503 });

  const postId = new URL(request.url).searchParams.get('post');
  if (!postId) return notFound();

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: post, error } = await admin
    .from('app_feed_posts')
    .select('id,title,excerpt,content,image_url,category,published,published_at,created_at,updated_at,audience_type')
    .eq('id', postId)
    .eq('published', true)
    .eq('audience_type', 'all')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (error || !post) return notFound();

  return new Response(articleHtml(post), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60, s-maxage=300',
      'x-content-type-options': 'nosniff',
    },
  });
});
