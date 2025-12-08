export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function sanitizeContent(input: string, maxBytes = 8000): string {
  const trimmed = input.trim();
  const encoder = new TextEncoder();
  const bytes = encoder.encode(trimmed);
  if (bytes.length > maxBytes) {
    // truncate to maxBytes boundary
    const decoder = new TextDecoder();
    return escapeHtml(decoder.decode(bytes.slice(0, maxBytes)));
  }
  return escapeHtml(trimmed);
}