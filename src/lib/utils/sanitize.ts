export function sanitizeString(str: string): string {
  // Simple HTML strip for non-rich-text fields
  return str.replace(/<[^>]*>?/gm, '').trim()
}
