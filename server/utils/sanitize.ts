export function sanitizeRichText(input: string): string {
  if (!input) return "";
  let out = String(input);
  // Remove script/style tags and their content
  {
    let prev;
    do {
      prev = out;
      out = out.replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
    } while (out !== prev);
  }
  // Remove iframe/object/embed tags entirely (including self-closing and void tags)
  {
    let prev;
    do {
      prev = out;
      // Match both paired tags and self-closing/void tags
      out = out.replace(/<\s*(iframe|object|embed)(?:[^>]*)>(?:[\s\S]*?<\s*\/\s*\1\s*>)?/gi, "");
    } while (out !== prev);
  }
  // Strip on* event handler attributes (quoted and unquoted, with any whitespace)
  {
    let prev;
    do {
      prev = out;
      // Match both quoted and unquoted event handlers, allowing tabs/newlines before 'on'
      out = out.replace(/\s+on[a-zA-Z]+\s*=\s*(?:(["'])[\s\S]*?\1|[^\s>]+)/gi, "");
    } while (out !== prev);
  }
  // Neutralize javascript: URLs in href/src
  out = out.replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, "$1=\"#\"");
  // Disallow data URLs for images that could be used for XSS vectors
  out = out.replace(/src\s*=\s*(["'])\s*data:[^"']*\1/gi, "src=\"#\"");
  // Remove meta tags which can be abused
  out = out.replace(/<\s*meta[^>]*>/gi, "");
  // Basic allowlist cleanup: remove comments
  {
    let prev;
    do {
      prev = out;
      out = out.replace(/<!--([\s\S]*?)-->/g, "");
    } while (out !== prev);
  }
  return out;
}
