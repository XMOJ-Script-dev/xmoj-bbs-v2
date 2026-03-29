import sanitizeHtml from "sanitize-html";

export function sanitizeTitle(input: string, maxBytes = 256): string {
  const trimmed = input.trim();
  const encoder = new TextEncoder();
  const bytes = encoder.encode(trimmed);
  const slice = bytes.length > maxBytes ? bytes.slice(0, maxBytes) : bytes;
  const decoded = new TextDecoder().decode(slice);
  return sanitizeHtml(decoded, { allowedTags: [], allowedAttributes: {} });
}