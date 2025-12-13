<<<<<<< Updated upstream
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
=======
export function sanitizeRichText(input: string): string {
  if (!input) return "";
  let out = String(input);
  // Remove script/style tags and their content
  out = out.replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  // Remove iframe/object/embed tags entirely
  out = out.replace(/<\s*(iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  // Strip on* event handler attributes
  out = out.replace(/ on[a-zA-Z]+\s*=\s*(["'])[\s\S]*?\1/gi, "");
  // Neutralize javascript: URLs in href/src
  out = out.replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, "$1=\"#\"");
  // Disallow data URLs for images that could be used for XSS vectors
  out = out.replace(/src\s*=\s*(["'])\s*data:[^"']*\1/gi, "src=\"#\"");
  // Remove meta tags which can be abused
  out = out.replace(/<\s*meta[^>]*>/gi, "");
  // Basic allowlist cleanup: remove comments
  out = out.replace(/<!--([\s\S]*?)-->/g, "");
  return out;
}
>>>>>>> Stashed changes
