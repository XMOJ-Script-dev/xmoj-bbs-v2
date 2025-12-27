import sanitizeHtml from 'sanitize-html';

export function sanitizeRichText(input: string): string {
  if (!input) return "";
  
  // Pre-process to handle potential XSS vectors as defense-in-depth
  // The sanitize-html library already handles these, but we add extra protection
  let processed = input
    // Remove any attempts at script injection
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove event handlers (on* attributes)
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '');
  
  return sanitizeHtml(processed, {
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
    allowedSchemes: ['https', 'mailto'],
    allowedSchemesByTag: {
      'img': ['https']
    },
    allowedClasses: {
      'code': ['language-javascript', 'language-python', 'language-cpp', 'language-c', 'language-java', 'hljs'],
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
      'a': (tagName: string, attribs: Record<string, string>) => {
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
