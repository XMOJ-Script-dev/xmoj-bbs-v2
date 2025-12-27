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
    nestingLimit: 50,
    // Automatically add rel="noopener noreferrer" to links with target="_blank"
    transformTags: {
      'a': (tagName, attribs) => {
        const rel = attribs.rel || '';
        const relParts = new Set(rel.split(/\s+/).filter(Boolean));
        
        // If target is _blank, ensure noopener and noreferrer are present
        if (attribs.target === '_blank') {
          relParts.add('noopener');
          relParts.add('noreferrer');
        }
        
        return {
          tagName,
          attribs: {
            ...attribs,
            rel: Array.from(relParts).join(' ')
          }
        };
      }
    }
  });
}
