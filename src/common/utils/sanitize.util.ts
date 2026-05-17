/**
 * Limpia una cadena de texto eliminando etiquetas HTML,
 * scripts y patrones de inyección comunes (XSS).
 * Se aplica en todos los DTOs mediante @Transform.
 */
export function sanitizeInput(value: unknown): string {
  if (typeof value !== 'string') return value as string;

  return (
    value
      .trim()
      // Elimina <script>...</script> y su contenido
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Elimina cualquier otra etiqueta HTML
      .replace(/<[^>]+>/g, '')
      // Elimina protocolo javascript:
      .replace(/javascript\s*:/gi, '')
      // Elimina manejadores de eventos inline (onclick=, onload=, etc.)
      .replace(/\bon\w+\s*=/gi, '')
      // Elimina data URIs peligrosos
      .replace(/data\s*:[^,]*,/gi, '')
      // Elimina expresiones de template que podrían ser inyectadas
      .replace(/\{\{.*?\}\}/g, '')
      .trim()
  );
}
