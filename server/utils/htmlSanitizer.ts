import sanitizeHtml from "sanitize-html";

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "b","i","em","strong","u","s","br","p","span",
      "ul","ol","li","blockquote","code","pre","kbd","hr",
      "a","img"
    ],
    allowedAttributes: {
      a: ["href","title","rel","target"],
      img: ["src","alt","title"],
      span: ["class"],
      code: ["class"],
      pre: ["class"]
    },
    allowedSchemes: ["http","https","mailto"],
    allowedSchemesByTag: {
      img: ["http","https"]
    },
    // Disallow inline event handlers and styles for safety
    allowVulnerableTags: false,
    allowedStyles: {},
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" })
    }
  });
}

export function sanitizeTitle(input: string, maxBytes = 256): string {
  const trimmed = input.trim();
  const encoder = new TextEncoder();
  const bytes = encoder.encode(trimmed);
  const slice = bytes.length > maxBytes ? bytes.slice(0, maxBytes) : bytes;
  const decoded = new TextDecoder().decode(slice);
  return sanitizeHtml(decoded, { allowedTags: [], allowedAttributes: {} });
}