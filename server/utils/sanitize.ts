import sanitizeHtml from 'sanitize-html';

export function sanitizeRichText(input: string): string {
  if (!input) return "";
  
  return sanitizeHtml(input, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'div': ['class'],
      'span': ['class'],
      'code': ['class'],
      'pre': ['class']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      'img': ['http', 'https', 'data']
    },
    allowedClasses: {
      'code': ['language-*', 'hljs'],
      'pre': ['hljs'],
      'div': ['code-block'],
      'span': ['mention']
    },
    // Disallow relative URLs
    allowProtocolRelative: false,
    // Remove all disallowed tags and their content
    disallowedTagsMode: 'recursiveEscape',
    // Enforce closing tags
    enforceHtmlBoundary: true,
    // Nest block elements properly
    nestingLimit: 50
  });
}
