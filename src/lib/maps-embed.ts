/**
 * Normaliza URL de embed de Google Maps.
 * Acepta URL directa o iframe completo; devuelve null si no es válida.
 */
export function sanitizeGoogleMapsEmbedUrl(
  input: string | null | undefined
): string | null {
  if (!input?.trim()) return null;

  let value = input.trim();

  const iframeSrc = value.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeSrc?.[1]) {
    value = iframeSrc[1];
  } else if (value.includes("<iframe")) {
    const looseSrc = value.match(/src=["']([^"']+)["']/i);
    if (looseSrc?.[1]) value = looseSrc[1];
  }

  value = value.replace(/&amp;/g, "&").trim();

  if (!value.startsWith("https://www.google.com/maps/embed")) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.hostname !== "www.google.com" || !url.pathname.startsWith("/maps/embed")) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}
